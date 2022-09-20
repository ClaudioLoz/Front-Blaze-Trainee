import React, {Component} from "react";
import ContainerWithTitle from "../../HOC/ContainerWithTitle";
import {connect} from "react-redux";
import {MenuItem, Menu, Drawer, Grid} from "@material-ui/core";
import {openErrorMessage} from '../../../actions/message';
import {SearchBarConnect} from "../../../components/MasterCatalog/SearchBar";
import FormMasterProduct from "../../../components/MasterCatalog/FormMasterProduct";
import {ModalCreateChildProductLoader} from "../../../components/MasterCatalog/ModalCreateChildProduct";
import {
    getListCombineProducts,
    updateArchiveMasterProduct,
    getListVendors,
    unlinkProductsFromParent,
    getListCategories,
    updateSingleMasterProducts,
    getListPriceTemplates,
    getListMemberGroups,
    getListBrands,
    setAdoptionModeMasterProducts,
    getMasterProductWithChilds,
    getListProductTags,
} from "../../../actions/masterCatalog";
import ModalUpdateMasterProduct from "../../../components/MasterCatalog/ModalUpdateMasterProduct";
import {getShopList} from "../../../actions/shop";
import {
    getProductNameRenderer, MCBrandCell,
} from "../../../components/MasterCatalog/Fields";
import {createFakeServer} from './MasterProductGrouping'
import {bulkUpdateOptions, EventEmitter, hideButtonToSupport, showButtonToSupport} from "../../../utils/common";
import ConfirmationModal from "../../../components/MasterCatalog/ConfirmationModal";
import {InventoryBatchesModalConnect} from "../../../components/MasterCatalog/Fields/InventoryBatchesModal";
import {
    Description,
    ProductImage,
    ProductStatus,
    ProductType,
    RetailValue, ShowInWidget,
    SKU,
    SyncToThirdPartyMenus,
    MCVendorCell,
    MCSecondaryVendorsCell,
    McProductTagsCell,
    Taxes,
    ProductBatch
} from "../../../components/MasterCatalog/Fields";
import ProductArchivedConnected from "../../../components/MasterCatalog/Fields/ProductArchived";
import {EditableSelect, EditableTextField} from "../../../components/common/EditableComponents";
import PriceIncludesExciseTaxConnected from "../../../components/MasterCatalog/Fields/PriceIncludesExciseTax";
import AgGrid from "../../../components/ag_grid/AgGrid";
import LowThresholdProductValueConnected from "../../../components/MasterCatalog/Fields/LowThresholdProductValue";
import ModalMcTaxes from "../../../components/MasterCatalog/Modals/ModalMcTaxes";
import ModalMcImages from "../../../components/MasterCatalog/Modals/ModalMcImages";
import { getProduct } from "../../../actions/inventory";

const ITEM_HEIGHT = 48;

const skip = 0
const limit = 20;

const sourceMapDefault = {
    active: "PARENT",
    archived: "PARENT",
    assets: "PARENT",
    description: "PARENT",
    priceIncludesExcise: "PARENT",
    productType: "PARENT",
    showInWidget: "PARENT",
    enableWeedmap: "PARENT",
    taxType: "PARENT",
    unitPrice: "PARENT",
    vendorId: "PARENT",
    secondaryVendors: "PARENT",
    brandId: "PARENT",
    lowThreshold: "PARENT"
  };

const getFilterOptions = [
    {label: "Active", value: "ACTIVE"},
    {label: "Inactive", value: "INACTIVE"},
    {label: "Archived", value: "ARCHIVED"}
]

let timeout;

class MasterProducts extends Component {
    constructor(props) {
        super(props);
        this.getAllMasterProducts = this.getAllMasterProducts.bind(this);
        this.state = {
            columnDefs: [
                {
                    headerName: "Inventory",
                    cellRendererFramework: InventoryBatchesModalConnect,
                    minWidth: 200,
                },
                {
                    field: "unitPrice",
                    headerName: "Retail Price",
                    minWidth: 200,
                    cellRendererFramework: (props)=>{
                        return <RetailValue
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "active",
                    headerName: "Status",
                    minWidth: 200,
                    cellRendererFramework: (props)=>{
                        return <ProductStatus
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "archived",
                    headerName: "Archived",
                    minWidth: 150,
                    cellRendererFramework: (props)=>{
                        return <ProductArchivedConnected
                              {...props}
                              processOnGrid={this.processOnGrid}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {field: "sku", headerName: "SKU", minWidth: 100, cellRendererFramework: SKU},
                {
                    field: "lowThreshold",
                    headerName: "LIT Threshold",
                    minWidth: 150,
                    cellRendererFramework: (props)=>{
                        return <LowThresholdProductValueConnected
                            {...props}
                            typeProduct={this.state.typeProduct}
                        />
                    },
                },
                {
                    field: "description",
                    headerName: "Description",
                    minWidth: 300,
                    cellRendererFramework: (props)=>{
                        return <Description
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "vendorId",
                    headerName: "Vendor",
                    minWidth: 300,
                    cellRendererFramework: (props)=>{
                        return <MCVendorCell
                              {...props}
                              {...this.props}
                              typeProduct={this.state.typeProduct}
                            />
                      },
                },
                {
                    field: "secondaryVendors",
                    headerName: "Secondary Vendors",
                    minWidth: 300,
                    cellRendererFramework: (props)=>{
                        return <MCSecondaryVendorsCell
                              {...props}
                              {...this.props}
                              typeProduct={this.state.typeProduct}
                            />
                      },
                },
                {
                    field: "tags",
                    headerName: "Tags",
                    minWidth: 300,
                    cellRendererFramework: (props)=>{
                        return <McProductTagsCell
                              {...props}
                              {...this.props}
                              typeProduct={this.state.typeProduct}
                            />
                      },
                },
                {
                    field: "brandId",
                    headerName: "Brand",
                    minWidth: 300,
                    cellRendererFramework: (props)=>{
                        return <MCBrandCell
                                {...props}
                                {...this.props}
                                typeProduct={this.state.typeProduct}
                               />
                      },
                },
                {
                    field: "productType", 
                    headerName: "Product Type", 
                    minWidth: 200,
                    cellRendererFramework: (props)=>{
                        return <ProductType
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    headerName: "Price Includes Excise Tax",
                    minWidth: 220,
                    cellRendererFramework: (props)=>{
                        return <PriceIncludesExciseTaxConnected
                              {...props}
                              processOnGrid={this.processOnGrid}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "enableWeedmap",
                    headerName: "Sync to 3rd Party Menus",
                    minWidth: 220,
                    cellRendererFramework: (props)=>{
                        return <SyncToThirdPartyMenus
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "showInWidget",
                    headerName: "Show in Online Widget",
                    minWidth: 200,
                    cellRendererFramework: (props)=>{
                        return <ShowInWidget
                              {...props}
                              typeProduct={this.state.typeProduct}
                              />
                      },
                },
                {
                    field: "oldestBatch",
                    headerName: "Batch Created",
                    minWidth: 200,
                    cellRendererFramework: ProductBatch
                },
                {
                    field: "assets",
                    headerName: "Images",
                    minWidth: 100,
                    cellRendererFramework: (props)=>{
                        return (
                            <ProductImage
                              {...props}
                              {...this.props}
                              openColumnModal={this.openColumnModal}
                              typeProduct={this.state.typeProduct}
                            />
                        )
                      },
                },
                {
                    field: "taxType",
                    headerName: "Taxes",
                    minWidth: 100,
                    cellRendererFramework: (props) => {
                        return (
                            <Taxes
                              {...props}
                              openColumnModal={this.openColumnModal}
                            />
                        )
                      },
                },
            ],
            fullData: [],
            defaultColDef: {
                flex: 1,
                resizable: true
            },
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: false,
                    selectedProducts: [],
                    property: "",
                    suppressCount: true,
                },
            },
            groupDefaultExpanded: 0,
            getRowNodeId: function (data) {
                return data.id;
            },
            openSideBarMasterProduct: false,
            openMenu: false,
            selectedProduct: null,
            anchorEl: null,
            actionToMasterProducts: [],
            selectedMasterProduct: null,
            selectedParentProduct: null,
            modalProductMaster: false,
            masterProducts: [],
            selectedProductType: "",
            optionToBulkUpdate: null,
            rowModelType: 'serverSide',
            serverSideStoreType: 'partial',
            isServerSideGroupOpenByDefault: function () {
                return false;
            },
            isServerSideGroup: function (dataItem) {
                return dataItem.group;
            },
            getServerSideGroupKey: function (dataItem) {
                return dataItem.id;
            },
            checkActive: false,
            checkInactive: false,
            checkArchived: false,
            filter: [],
            term: "",
            openModalToClone: false,
            showModalConfirmation: false,
            key: '',
            modalDetail: {},
            typeProduct: "master",
            adoptionMode: false,
            numEnterKeyPage: 0,
            
            selectedData: null,
            agGridProps: {},
            showModalMcTaxes: false
        };
        this.onGridReady = this.onGridReady.bind(this);
        this.updateMasterProduct = this.updateMasterProduct.bind(this);
        this.dataFormat = this.dataFormat.bind(this)
        this.serverSideDatasource = this.serverSideDatasource.bind(this);
        this.handleChangeTypeProduct = this.handleChangeTypeProduct.bind(this);
        this.formatterData = this.formatterData.bind(this);
        this.processOnGrid = this.processOnGrid.bind(this);
        this.onPaginationChanged = this.onPaginationChanged.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const { companyFeatures={} } = this.props.companyReducer || {};
        if(companyFeatures.enableMasterCatalog != null && !companyFeatures.enableMasterCatalog){
          return this.props.history.push("/");
        }
    }

    componentWillMount() {
        this.props.dispatch(getListVendors());
        this.props.dispatch(getListBrands());
        this.props.dispatch(getShopList());
        this.props.dispatch(getListCategories());
        this.props.dispatch(getListPriceTemplates());
        this.props.dispatch(getListMemberGroups());
        this.props.dispatch(getListProductTags());
        EventEmitter.subscribe("updateProductList", () => {
            this.getAllMasterProducts();
        });

        this.props.dispatch(setAdoptionModeMasterProducts(false));
        localStorage.removeItem("ADOPTION_MODE");
        localStorage.removeItem("ADOPTION_MODE_VERIFY");
    }

    getAllMasterProducts = () => {
        this.processOnGrid();
    };

    handleChangeTypeProduct = (value) => {

        this.uncheckAllCheckboxes()
        
        this.setState({
            typeProduct: value,
            masterProducts: [],
            selectedProductType: "",
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: false,
                    selectedProducts: [],
                    property: "",
                },
            }
        }, () => {
            this.processOnGrid();
        })
    }

    isFullWidth = (data) => {
        return data.component === "select";
    };

    openColumnModal = (column, isParent, data, agGridProps) => {
        const { shopReducer } = this.props;

        if (isParent) {
            this.props.dispatch(getMasterProductWithChilds(data.id)).then(res => {
                this.setState({selectedData: res, agGridProps});
                this.openModalByColumn(column);
            });
        } else {
            this.props.dispatch(getProduct(data.id)).then(res => {
                const selectedShop = shopReducer && shopReducer.shopsList && shopReducer.shopsList.values && shopReducer.shopsList.values.find((shop) => shop.id === res.shopId);
                res.shop = selectedShop;
                this.setState({selectedData: res, agGridProps});
                this.openModalByColumn(column);
            });
        }
    }

    openModalByColumn = (column) => {
        switch (column) {
            case "taxes":
                return this.setState({showModalMcTaxes: true});
                break;
            case "productImages":
                return this.setState({showModalMcImages: true});
        }
    }

    // Update selected master products
    handleCheck = (check, data) => {
        let result = [...this.state.masterProducts] || [];
        const { adoptionMode } = this.props.masterCatalogReducer
        let property = data.children ? "parent" : (!data.masterId ? "orphan" : "child");

        if (check.target.checked) {
            if (adoptionMode && property === "parent") {
                if (result.length > 0) {

                    this.setState({
                        autoGroupColumnDef: {
                            field: 'name',
                            headerName: "Name & Store",
                            minWidth: 250,
                            pinned: true,
                            cellRendererParams: {
                                innerRenderer: getProductNameRenderer(),
                                checkEvent: this.handleCheck,
                                menuEvent: this.handleMenu,
                                adoptionMode: adoptionMode,
                                selectedProducts: this.state.masterProducts,
                                property: this.state.selectedProductType,
                            },
                        },
                    }, () => {

                        this.props.dispatch(
                            openErrorMessage('Only one master product can be selected at a time.')
                        )
                    })
                    
                    return
                }
            }
        
            result.push(data);
        } else {
            result = result.filter((c) => c.id !== data.id);
        }

        this.setState({
            masterProducts: result,
            selectedProductType: property,
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: false,
                    selectedProducts: result,
                    property: property
                },
            },
        }, () => {
            //this.handleAdoptionMode(!!this.props.masterCatalogReducer.adoptionMode);
        });
    };

    // Define options for the selected product
    handleMenu = (image, data) => {
        let actions = [
            {key: "edit", value: "Edit"},
        ];

        if(data.children){
            actions.push({key: "cloneToNewLocation", value: "Clone to new Location"});
        } else if(data.masterId){
            actions.push({key: "pushChildDataToParent", value: "Push Child Data to Parent"});
            actions.push({key: "makeOrphan", value: "Make Orphan"});
        }

        this.setState({
            anchorEl: image.currentTarget,
            actionToMasterProducts: actions,
            selectedMasterProduct: data,
        });
    };

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.processOnGrid();
    };

    serverSideDatasource = (typeProduct, {term = ""}, {filter = []}) => {
        const $this = this;
        return {
            getRows: function (params) {
                if (params.parentNode.data) {
                    let server = createFakeServer([params.parentNode.data]);
                    let response = server.getData(params.request)
                    setTimeout(function () {
                        params.successCallback(response, response.length);
                    }, 200)
                } else {
                    let page = params.request.endRow / 20;
                    $this.props.dispatch(getListCombineProducts((page - 1) * 20, 20, term, filter, "", "", typeProduct)).then(res => {
                        if (res.total > 0) {
                            let lastRow = () => {
                                return res.total || -1;
                            }
                            const processData = $this.formatterData(res && res.values);
                            let server = createFakeServer(processData);
                            let response = server.getData(params.request)
                            setTimeout(function () {
                                params.successCallback(response, lastRow());
                            }, 200)
                            $this.setState({
                                fullData: processData
                            });
                        } else {
                            params.successCallback([], 0);
                        }
                    })
                }
            }
        }
    }

    formatterData = (data = []) => {
        let result = []
        data.forEach(product => {
            let newProduct = product.orphan ? product.orphan : product.master
            result.push(newProduct)
        })
        return result
    }

    processOnGrid = () => {
        const {typeProduct, term, filter} = this.state
        this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeProduct, {term: term || ""}, {filter: filter || []}));
    }

    processFilterOnGrid = (filter) => {
        this.processOnGrid();
    }

    onFilterTextBoxChanged = (event) => {
        const term = event.target.value;
        const {masterCatalogReducer} = this.props;
        const {typeProduct = "master"} = this.state;
        const {filter = []} = this.props.filter || {};

        this.setState({term:term});
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!term) {
                this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeProduct, {term: ""}, {filter: filter.join()}))
            }

            if (term) {
                this.setState({
                    timeout: setTimeout(() => {
                        if (term) {
                            this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeProduct, {term: term}, {filter: filter.join()}))
                        }
                    }, 500)
                })
            }
        }, 1500)
    }

    onFilterSwitchChanged = (state) => {
        const {typeProduct = "master", term} = this.state;
        let filterResult = state.map(filter => filter.value) || []
        this.setState({
            filter: filterResult
        })
        this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeProduct, {term:term}, {filter: filterResult.join()}))
    }

    onRowSelected = (event) => {
        const rows = event.api.getSelectedNodes().map(row => {
            return row.data;
        });
        this.setState({masterProducts: rows});
    }

    dataFormat = (data) => {
        let newArray = [];

        data.forEach((parent) => {
            newArray.push({
                orgHierarchy: [parent.name],
                ...parent
            })
            parent.children.forEach((child, index) => {
                newArray.push({
                    orgHierarchy: [parent.name, child.name + index],
                    ...child
                })
            })
        });
        return newArray;
    };

    updateMasterProduct = (key) => {
        switch (key) {
            case "cloneToNewLocation":
                this.cloneToNewLocation();
                break;
            case "makeOrphan":
                this.makeOrphan();
                break;
            case "edit":
                this.handleClickOpen(false)
                break;
            case "pushChildDataToParent":
                this.pushChildDataToParent()
                break;
            default:
                break;
        }
        this.handleCloseMenu();
    };

    beforeUpdateProduct = (key) => {
        let data = null
        switch (key) {
            case "cloneToNewLocation":
                 this.cloneToNewLocation();
                break;
            case "makeOrphan":
                data = {
                    title: "Unlink from Parent",
                    description: "Making it an Orphan keeps the Parent values. Updating will make it an Orphan, while not updating will keep as a Child."
                }
                break;
            case "edit":
                this.updateMasterProduct(key)
                break;
            case "pushChildDataToParent":
                data = {
                    title: "Update Parent values from selected Child",
                    description: "Updating will replace the parent values with the child values."
                }
                break;
            default:
                break;
        }
        if (data) {
            this.setState({
                key,
                modalDetail: data,
                showModalConfirmation: true
            })
        }
    }

    cloneToNewLocation = () => {
        this.setState({
            openModalToClone: true
        })
    }

    pushChildDataToParent = () => {
        const {selectedMasterProduct, fullData} = this.state
        const parent = fullData.find(p => p.id === selectedMasterProduct.masterId)
        const newData = {
            ...parent,
            ...selectedMasterProduct,
            id: parent.id,
            masterCategoryId: parent.masterCategoryId,
            categoryId: null,
            category: null,
            masterId: null
        }
        this.props.dispatch(updateSingleMasterProducts(newData))
            .then(() => {
                this.getAllMasterProducts()
            })
    }

    makeOrphan = () => {
        const {selectedMasterProduct} = this.state;    
        this.props.dispatch(unlinkProductsFromParent(selectedMasterProduct.id)).then(() => {
            this.props.dispatch(getMasterProductWithChilds(selectedMasterProduct.masterId)).then((mp) => {
                const shopsSelected = mp.shopIds && mp.shopIds.filter(shopId => shopId !== selectedMasterProduct.shopId) || [];      
                if (mp.children && mp.children.length == 0) {
                    const data = {
                        masterProductId: selectedMasterProduct.masterId,
                        isArchived: true
                    }
                    this.props.dispatch(updateArchiveMasterProduct(data)).then(() => {
                        const newData = {...mp, archived: true, shopIds: shopsSelected};
                        this.props.dispatch(updateSingleMasterProducts(newData));
                        timeout = setTimeout(() => {
                            this.getAllMasterProducts();
                            clearTimeout(timeout)
                        }, 3000);
                    });
                } else { 
                    const newData = {...mp, shopIds: shopsSelected};   
                    this.props.dispatch(updateSingleMasterProducts(newData)).then(() => {
                        this.getAllMasterProducts();
                    });  
                }
            });    
        })
    };

    updateArchiveMasterProduct = () => {
        const {selectedMasterProduct} = this.state;
        const data = {
            masterProductId: selectedMasterProduct.id,
            isArchived: !selectedMasterProduct.archived,
        };
        this.props.dispatch(updateArchiveMasterProduct(data)).then((response) => {
            this.getAllMasterProducts();
        });
    };

    handleClickOpen = (create = true) => {
        if (create) {
            this.setState({
                selectedMasterProduct: null
            })
        }
        hideButtonToSupport()
        this.setState({openSideBarMasterProduct: true});
    };

    handleClose = (update = false) => {
        showButtonToSupport()
        this.setState({openSideBarMasterProduct: false, selectedMasterProduct: null});
        if (update === true) {
            this.getAllMasterProducts();
        }
    };

    handleCloseMenu = () => {
        this.setState({anchorEl: null});
        this.closeConfirmationModal()
    };

    bulkUpdate = (selected) => {
        this.setState({
            modalProductMaster: true,
            optionToBulkUpdate: bulkUpdateOptions[selected],
        });
    };

    handleCloseModalProductMaster = (update) => {
        this.setState({
            modalProductMaster: false,
        });
        if (update === true) {
            this.setState({
                masterProducts: [],
                optionToBulkUpdate: null,
            }, () => {
                this.handleDeactivateAdoptionMode()
            });
            this.getAllMasterProducts();
        }
    };

    handleCloseModalToClone = (update = false) => {
        this.setState({
            openModalToClone: false,
            selectedMasterProduct: null
        })
        if (update === true) {
            this.getAllMasterProducts()
        }
    }

    //Reset column group
    handleAdoptionMode = () => {
        const { masterProducts, selectedProductType, adoptionMode } = this.state

        this.setState({
            adoptionMode: adoptionMode,
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: adoptionMode,
                    selectedProducts: masterProducts,
                    property: selectedProductType,
                },
            },
        })
    }

    handleDeactivateAdoptionMode = () => {

        this.setState({
            selectedParentProduct: null,
            typeProduct: "master",
            adoptionMode: false,
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: false,
                    selectedProducts: [],
                    property: ""
                },
            },
            masterProducts: [],
            selectedProductType: ""
        })
        localStorage.removeItem("ADOPTION_MODE")
        localStorage.removeItem("ADOPTION_MODE_VERIFY")

    }

    handleCloseEverything = (update) => {
        this.handleDeactivateAdoptionMode()
        
        if(this.state.typeProduct == "master"){
            this.handleChangeTypeProduct("master")
        } else {
            this.handleChangeTypeProduct("orphan")
        }
        
        if (update) {
            this.getAllMasterProducts()
        }
        this.setState({
            selectedParentProduct: null
        })
    }

    closeConfirmationModal = () => {
        this.setState({
            key: "",
            modalDetail: {},
            showModalConfirmation: false
        })
    }

    onPaginationChanged() {
        if (this.gridApi) {
            let totalPages = this.gridApi.paginationGetTotalPages();
            let currentPage = this.gridApi.paginationGetCurrentPage() + 1;
            let totalRows = this.gridApi.paginationGetRowCount();
            let pageSize = this.gridApi.paginationGetPageSize();
            let fromRow = (this.gridApi.paginationGetCurrentPage() * pageSize) + 1;
            let toRow = (this.gridApi.paginationGetCurrentPage() + 1) * pageSize;
            toRow = (toRow > totalRows) ? totalRows : toRow;

            this.setText('#ag-445-of-page-number', totalPages);
            this.setText('#ag-445-start-page-number', currentPage);
            this.setText('#ag-445-first-row', fromRow);
            this.setText('#ag-445-last-row', toRow);
            this.setText('#ag-445-row-count', totalRows); 

            this.setButtonDisabled('#btFirst', (currentPage <= 1));
            this.setButtonDisabled('#btPrevious', (currentPage <= 1));
            this.setButtonDisabled('#btNext', (totalPages == currentPage));
            this.setButtonDisabled('#btLast', (totalPages == currentPage));
        }
    };

    setText(selector, text) {
        document.querySelector(selector).innerHTML = text;
    }

    setButtonDisabled(selector, disabled) {
        let classDisable = 'ag-disabled';

        if (disabled) {
            document.querySelector(selector).classList.add(classDisable);
        } else {
            document.querySelector(selector).classList.remove(classDisable);
        }
    }

    onBtFirst() {
        this.gridApi.paginationGoToFirstPage();
    }

    onBtLast() {
        this.gridApi.paginationGoToLastPage();
    }

    onBtNext() {
        this.gridApi.paginationGoToNextPage();
    }

    onBtPrevious() {
        this.gridApi.paginationGoToPreviousPage();
    }

    onBtNumberPage(page) {
        let numPage = parseInt(page) - 1;
        this.gridApi.paginationGoToPage(numPage);
    }

    onBtNumberPageChange(event) {
        this.setState({
            numEnterKeyPage: event.target.value
        })
    }

    onBtNumberPageKeyDown(event) {
        const { numEnterKeyPage } = this.state;

        if (event.key === 'Enter') {
            this.onBtNumberPage(numEnterKeyPage);
        }
    }

    uncheckAllCheckboxes() {
        var checkboxes = document.querySelectorAll(".check-name");
        for (var checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }

    saveParentProduct = (parent) => {
      
        this.setState({
            selectedParentProduct: parent,
            autoGroupColumnDef: {
                field: 'name',
                headerName: "Name & Store",
                minWidth: 250,
                pinned: true,
                cellRendererParams: {
                    innerRenderer: getProductNameRenderer(),
                    checkEvent: this.handleCheck,
                    menuEvent: this.handleMenu,
                    adoptionMode: true,
                    selectedProducts: this.state.masterProducts,
                    property: "orphan",
                },
            },
        })
        
    }

    render() {
        const {
            checkActive,
            checkInactive,
            checkArchived,
            openSideBarMasterProduct,
            anchorEl,
            actionToMasterProducts,
            modalProductMaster,
            masterProducts,
            optionToBulkUpdate,
            selectedMasterProduct,
            openModalToClone,
            fullData,
            showModalConfirmation,
            key,
            modalDetail,
            term,
            typeProduct,
            adoptionMode,
            selectedProductType,
            filter,
            selectedData,
            agGridProps,
            showModalMcTaxes,
            showModalMcImages
        } = this.state;
        const { shopsList = {} } = this.props.shopReducer;
        const open = Boolean(anchorEl);
        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={12}>
                        <SearchBarConnect
                            checkActive={checkActive}
                            checkInactive={checkInactive}
                            checkArchived={checkArchived}
                            saveParentProduct={this.saveParentProduct}
                            handleFilterChange={this.onFilterSwitchChanged}
                            buttonText={"New Product"}
                            openModal={this.handleClickOpen}
                            bulkUpdate={this.bulkUpdate}
                            handleTermChange={this.onFilterTextBoxChanged}
                            filter={filter}
                            handleAdoptionMode={this.handleAdoptionMode}
                            deactivateAdoptionMode={this.handleDeactivateAdoptionMode}
                            selectedProducts={masterProducts}
                            onProductTypeChange={this.handleChangeTypeProduct}
                            closeEverything={this.handleCloseEverything}
                            fullData={fullData}
                            getFilterOptions={getFilterOptions}
                            processOnGrid={this.processFilterOnGrid}
                            term={term}
                            skip={skip}
                            limit={limit}
                            selectedProductType={selectedProductType}
                            selectedParentProduct={this.state.selectedParentProduct}
                            sourceMapDefault={sourceMapDefault}
                            typeProduct={typeProduct}
                        />
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid className="labelField" item xs={6} sm={6} md={6} lg={2}>
                            <p>
                                {masterProducts && masterProducts.length || 0} {selectedProductType} products selected
                            </p>
                        </Grid>
                        {!adoptionMode && <Grid className="editField" item xs={4} sm={4} md={2}>
                            <EditableSelect
                                style={{width: "20%"}}
                                name="type"
                                value={typeProduct}
                                valueToRender={typeProduct}
                                onChange={(e) => this.handleChangeTypeProduct(e.target.value)}
                                material={false}
                                editMode={true}
                            >
                                <MenuItem value="master">Master Products</MenuItem>
                                <MenuItem value="orphan">Orphan Products</MenuItem>
                            </EditableSelect>
                        </Grid>}
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={12}>
                            <div className="ag-theme-alpine container-aggrid" style={{height: "640px", marginBottom: "40px"}}>
                                <AgGrid
                                    columnDefs={this.state.columnDefs}
                                    defaultColDef={this.state.defaultColDef}
                                    autoGroupColumnDef={this.state.autoGroupColumnDef}
                                    treeData={true}
                                    sideBar={{
                                        toolPanels: [
                                        {
                                            id: 'columns',
                                            labelDefault: 'Columns',
                                            labelKey: 'columns',
                                            iconKey: 'columns',
                                            toolPanel: 'agColumnsToolPanel',
                                            toolPanelParams: {
                                            suppressRowGroups: true,
                                            suppressValues: true,
                                            suppressPivots: true,
                                            suppressPivotMode: true
                                            }
                                        }
                                        ],
                                    }}
                                    animateRows={true}
                                    onGridReady={this.onGridReady}
                                    rowModelType={this.state.rowModelType}
                                    rowHeight={50}
                                    pagination={true}
                                    paginationPageSize={20}
                                    cacheBlockSize={20}
                                    maxBlocksInCache={20}
                                    serverSideStoreType={this.state.serverSideStoreType}
                                    isServerSideGroupOpenByDefault={this.state.isServerSideGroupOpenByDefault}
                                    isServerSideGroup={this.state.isServerSideGroup}
                                    getServerSideGroupKey={this.state.getServerSideGroupKey}
                                    onRowSelected={this.onRowSelected}
                                    onPaginationChanged={this.onPaginationChanged}
                                    suppressPaginationPanel={true}
                                />
                                <div className="ag-paging-panel ag-unselectable pagination-position" id="ag-445" aria-live="polite" aria-describedby="ag-445-start-page ag-445-start-page-number ag-445-of-page ag-445-of-page-number ag-445-first-row ag-445-to ag-445-last-row ag-445-of ag-445-row-count">
                                    <span className="ag-paging-row-summary-panel" aria-hidden="true">
                                        <span id="ag-445-first-row" ref="lbFirstRowOnPage" className="ag-paging-row-summary-panel-number">0</span>
                                        <span id="ag-445-to"> to </span>
                                        <span id="ag-445-last-row" ref="lbLastRowOnPage" className="ag-paging-row-summary-panel-number">0</span>
                                        <span id="ag-445-of"> of </span>
                                        <span id="ag-445-row-count" ref="lbRecordCount" className="ag-paging-row-summary-panel-number">0</span>
                                    </span>
                                    <EditableTextField
                                        placeholder={"Page"}
                                        editMode={true}
                                        material={false}
                                        style={{maxWidth: "5em", margin: "unset"}}
                                        onChange={(e) => this.onBtNumberPageChange(e)}
                                        onKeyDown={(e) => this.onBtNumberPageKeyDown(e)}
                                    />
                                    <span className="ag-paging-page-summary-panel" role="presentation">
                                        <div id="btFirst" ref="btFirst" className="ag-paging-button ag-disabled" role="button" aria-label="First Page" tabindex="0" aria-disabled="true"><span className="ag-icon ag-icon-first" unselectable="on" role="presentation"  onClick={() => this.onBtFirst()}></span></div>
                                        <div id="btPrevious" ref="btPrevious" className="ag-paging-button ag-disabled" role="button" aria-label="Previous Page" tabindex="0" aria-disabled="true"><span className="ag-icon ag-icon-previous" unselectable="on" role="presentation" onClick={() => this.onBtPrevious()}></span></div>
                                        <span className="ag-paging-description" aria-hidden="true">
                                            <span id="ag-445-start-page">Page </span>
                                            <span id="ag-445-start-page-number" ref="lbCurrent" className="ag-paging-number">0</span>
                                            <span id="ag-445-of-page"> of </span>
                                            <span id="ag-445-of-page-number" ref="lbTotal" className="ag-paging-number">0</span>
                                        </span>
                                        <div id="btNext" ref="btNext" className="ag-paging-button" role="button" aria-label="Next Page" tabindex="0" aria-disabled="false"><span className="ag-icon ag-icon-next" unselectable="on" role="presentation" onClick={() => this.onBtNext()}></span></div>
                                        <div id="btLast" ref="btLast" className="ag-paging-button" role="button" aria-label="Last Page" tabindex="0" aria-disabled="false"><span className="ag-icon ag-icon-last" unselectable="on" role="presentation" onClick={() => this.onBtLast()}></span></div>
                                    </span>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                {openSideBarMasterProduct &&
                    <Drawer anchor="right" open={openSideBarMasterProduct}>
                    <FormMasterProduct openColumnModal={this.openColumnModal} handleClose={this.handleClose} product={selectedMasterProduct} shops={shopsList && shopsList.values} sourceMapDefault={sourceMapDefault}/>
                    </Drawer>
                }
                {open && 
                 <Menu
                 id="long-menu"
                 anchorEl={anchorEl}
                 open={open}
                 onClose={this.handleCloseMenu}
                 PaperProps={{
                     style: {
                         maxHeight: ITEM_HEIGHT * 4.5,
                         minWidth: 200,
                     },
                 }}
                 >
                 {actionToMasterProducts.map((option) => (
                     <MenuItem
                         key={option.key}
                         onClick={() => this.beforeUpdateProduct(option.key)}
                     >
                         {option.value}
                     </MenuItem>
                 ))}
                 </Menu>
                }
               
                {modalProductMaster && 
                    <ModalUpdateMasterProduct
                    open={modalProductMaster}
                    handleClose={this.handleCloseModalProductMaster}
                    masterProducts={masterProducts}
                    optionToBulkUpdate={optionToBulkUpdate}
                    />
                }
                
                {selectedMasterProduct && 
                    <ModalCreateChildProductLoader
                    open={openModalToClone}
                    product={selectedMasterProduct}
                    handleCloseModalToClone={this.handleCloseModalToClone}
                />
                }
                
                {showModalConfirmation &&
                <ConfirmationModal open={showModalConfirmation} keyOption={key}
                                   close={this.closeConfirmationModal} {...modalDetail}
                                   handleContinue={this.updateMasterProduct}/>
                }
                {
                    showModalMcTaxes && (
                        <ModalMcTaxes
                            {...agGridProps}
                            dispatch={this.props.dispatch}
                            open={showModalMcTaxes}
                            onClose={() => { this.setState({showModalMcTaxes: false, selectedData: null}) }}
                            isParent={selectedData && !!selectedData.children || false}
                            data={selectedData}
                        />
                    )
                }
                {
                    showModalMcImages && (
                        <ModalMcImages
                        {...agGridProps}
                        dispatch={this.props.dispatch}
                        open={showModalMcImages}
                        onClose={() => { this.setState({showModalMcImages: false, selectedData: null}) }}
                        isParent={selectedData && !!selectedData.children || false}
                        data={selectedData}
                    />
                    )
                   
                }
            </React.Fragment>
        );
    }
}

const MasterProductWithTitle = ContainerWithTitle(
    MasterProducts,
    "Master Products"
);
const MasterProductConnected = connect(
    ({dispatch, shopReducer, masterCatalogReducer, companyReducer}) => ({
        dispatch,
        shopReducer,
        masterCatalogReducer,
        companyReducer
    })
)(MasterProductWithTitle);

export default MasterProductConnected;
