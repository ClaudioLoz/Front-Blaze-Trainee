import React, { PureComponent } from "react";
import { connect } from "react-redux";
import ContainerWithTitle from "../../HOC/ContainerWithTitle";
import {SearchBarConnect} from "../../../components/MasterCatalog/SearchBar";
import {openErrorMessage} from '../../../actions/message';
import {MenuItem, Grid, Menu} from "@material-ui/core";
import {createFakeServer} from './MasterCategoryGrouping'
import {
  getListCategories,
  setListCategories,
  getCombinedCategoryList,
  getComplianceCategoryList,
  setAdoptionModeMasterProducts,
  unlinkCategoriesFromParent,
  getMasterCategory,
  updateSingleMasterCategories
} from "../../../actions/masterCatalog";
import FormMasterCategory from "../../../components/MasterCatalog/FormMasterCategory";
import ModalAssignStores from "../../../components/MasterCatalog/ModalAssignStores";
import { getShopList } from "../../../actions/shop";
import ModalUpdateMasterCategory from "../../../components/MasterCatalog/ModalUpdateMasterCategory";
import { updateArchiveMasterCategory } from "../../../actions/masterCatalog";
import GridManageViewsPanel from "../../../components/MasterCatalog/Components/GridManageViewsPanel";
import { getAgGridViewsAPI } from "../../../api/ag-grid-views";
import { hasKeys, showButtonToSupport, hideButtonToSupport } from "../../../utils/common";
import { catalogTestingViews } from "../../../utils/constants";
import MenuMoreActions from "../../../components/MasterCatalog/Components/MenuMoreActions";
import ConfirmationModal from "../../../components/MasterCatalog/ConfirmationModal";
import {EditableSelect, EditableTextField} from "../../../components/common/EditableComponents";
import {
  getCategoryNameRenderer, McStoreCountCell,
} from "../../../components/MasterCatalog/Fields";
import {
  McCategoryTypeCell,
  McTopLevelCell,
  McUnitTypeCell,
  McLowThresholdCell,
  McImageCell,
  McComplianceCategoryCell,
  McStatusCell
} from "../../../components/MasterCatalog/Fields";
import AgGrid from "../../../components/ag_grid/AgGrid";

const ITEM_HEIGHT = 48;

const bulkUpdateOptions = {
  "Category Type": {
    name: "Category Type",
    field: "cannabis",
    action: "CATEGORY_TYPE",
  }, 
  Measurement: {
    name: "Measurement",
    field: "unitType",
    action: "MEASUREMENT",
  },
  LIT: {
    name: "Lit",
    field: "lowThreshold",
    action: "LOW_INVENTORY_THRESHOLD",
  },
  Archived: {
    name: "Archived",
    field: "archived",
    action: "ARCHIVE_STATUS",
  },
};

const cellStyle = {
  borderLeft:"1px solid #EEEEEE !important",
  borderRight:"1px solid #EEEEEE !important"
}

const getFilterOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" }
]

const sourceMapDefault = {
  active: "PARENT",
  archived: "PARENT",
  cannabis: "PARENT",
  complianceId: "PARENT",
  lowThreshold: "PARENT",
  photo: "PARENT",
  topLevelCategoryName: "PARENT",
  unitType: "PARENT",
};

let timeout;

class MasterCatalog extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "photo.thumbURL",
          headerName: "Image",
          minWidth: 200,
          filter: false,
          sortable: false,
          cellRendererFramework: (props)=>{
            return <McImageCell
                    {...props}
                    {...this.props}
                    typeCategory={this.state.typeCategory}
                  />
          },
        },
        { 
          field: "cannabis", 
          headerName: "Category Type", 
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McCategoryTypeCell
                    {...props}
                    {...this.props}
                    typeCategory={this.state.typeCategory}
                  />
          },
        },
        {
          field: "topLevelCategoryName",
          headerName: "Top Level",
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McTopLevelCell
                    {...props}
                    {...this.props}
                    typeCategory={this.state.typeCategory}
                  />
          },
        },
        {
          field: "complianceId",
          headerName: "Compliance Category",
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McComplianceCategoryCell
                    {...props}
                    {...this.props}
                    complianceCategories={this.state.complianceCategories}
                  />
          },
        },
        {
          field: "unitType",
          headerName: "Measurement",
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McUnitTypeCell
                    {...props}
                    {...this.props}
                    typeCategory={this.state.typeCategory}
                  />
          },
        },
        {
          field: "lowThreshold",
          headerName: "LIT ",
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McLowThresholdCell
                    {...props}
                    {...this.props}
                    typeCategory={this.state.typeCategory}
                  />
          },
        },
        {
          field: "storeCount",
          headerName: "Stores",
          minWidth: 200,
          cellRendererFramework: (props)=>{
            return <McStoreCountCell
                    {...props}
                    {...this.props}
                    handleClickOpenAssignStores={this.handleClickOpenAssignStores}
                  />
          },
        },
        {
          field: "statusName",
          headerName: "Status",
          minWidth: 200,
          cellRendererFramework: (props)=>{
              return <McStatusCell
                    {...props}
                    {...this.props}
                    processOnGrid={this.processOnGrid}
                    typeCategory={this.state.typeCategory}
                  />
          },
          cellClass: 'category-aggrip-cell-input'
        },
        
      ],
      complianceCategories: [],
      autoGroupColumnDef: {
        field: 'name',
        headerName: "Category Name",
        minWidth: 250,
        pinned: true,
        cellRendererParams: {
            innerRenderer: getCategoryNameRenderer(),
            checkEvent: this.handleCheck,
            menuEvent: this.handleMenu,
            adoptionMode: false,
            selectedRows: [],
            property: "",
            suppressCount: true
        },
      },
      defaultColDef: {
        flex: 1,
        filter: true,
        sortable: true,
        resizable: true,
        headerClass:'catalog-aggrid-header',
        cellClass: 'catalog-aggrid-cell',
        cellStyle: cellStyle
      },
      paginationPageSize: 20,
      pageNumber: 1,
      checkActive: false,
      checkInactive: false,
      checkArchived: false,
      childCategories: [],
      anchorEl: null,
      selectedRows: [],
      showModalConfirmation: false,
      modalCategoryMaster: false,
      optionToBulkUpdate: null,
      selectedMasterCategory: null,
      selectedView: {},
      views: [],
      viewType: catalogTestingViews.MASTER_CATEGORIES.value,
      updateOption: true,
      typeCategory: "master",
      term: "",
      filter: [],
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
      groupDefaultExpanded: 0,
      getRowNodeId: function (data) {
        return data.id;
      },
      categoryActions: [],
      openMasterCategorySideBar: false,
      selectedCategoryType: "",
      adoptionMode: false,
      numEnterKeyPage: 0
    };

    this.onGridReady = this.onGridReady.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateMasterCategory = this.updateMasterCategory.bind(this);
    this.updateListCategory = this.updateListCategory.bind(this);
    this.onPaginationChanged = this.onPaginationChanged.bind(this);
  }

  componentDidMount () {
    let request = [];
    request.push(this.getViews());
    this.props.dispatch(getShopList());
    this.props.dispatch(getComplianceCategoryList()).then( res => {
      this.setState({
        complianceCategories: res.values
      })
    });

    this.props.dispatch(setAdoptionModeMasterProducts(false));
    localStorage.removeItem("ADOPTION_MODE");
    localStorage.removeItem("ADOPTION_MODE_VERIFY");
  }

  componentWillReceiveProps(nextProps){
    const { companyFeatures={} } = this.props.companyReducer || {};
    if(companyFeatures.enableMasterCatalog != null && !companyFeatures.enableMasterCatalog){
      return this.props.history.push("/");
    }

    if(nextProps.selectedView !== this.props.selectedView){
      this.gridApi.gridCore.sideBarComp.toolPanelWrappers[2].toolPanelCompInstance.componentInstance.setSelectedView(nextProps.selectedView && nextProps.selectedView.data)
    }
    if(hasKeys(this.props.data) && hasKeys(nextProps.data) && this.props.data!==nextProps.data){
        this.props.dispatch(setListCategories(nextProps.data));
        this.setState({
            dataFiltered:false,
        })
    }
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.processOnGrid();
  };

  processOnGrid = () => {
    const { typeCategory, term, filter } = this.state
    this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeCategory, { term: term || "" }, { filter: filter || [] }));
  }

  serverSideDatasource = (typeCategory, {term = ""}, {filter = []}) => {
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
                $this.props.dispatch(getCombinedCategoryList((page - 1) * 20, 20, term, filter, typeCategory)).then(res => {
                    if (res.total > 0) {
                        let lastRow = () => {
                            return res.total || -1;
                        }
                        const processData = $this.dataFormatter(res && res.values);
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

  dataFormatter = (data = []) => {
    let result = []
    if(data)
    data.forEach(product => {
        let newProduct = product.orphan ? product.orphan : product.master
        result.push(newProduct)
    })
    return result
}

  updateData = (data) => {
    this.setState({ fullData: data });
    this.props.dispatch(setListCategories(data));
  }

  onRowSelected = (event) => {  
    const rows = event.api.getSelectedNodes().map(row => {   
      return row.data;
    });
    this.setState({selectedRows:rows});
  }

  updateListCategory = () => {
    this.processOnGrid();
    this.handleClose();
  }

  handleChange = (check, event) => {
    this.setState(
      {
        [check]: event.target.checked,
      },
      () => {
        this.manageFilterSearchBar();
      }
    );
  };

  manageFilterSearchBar = () => {
    const { fullData, checkActive, checkInactive, checkArchived } = this.state;

    let dataActive = [];
    let dataInactive = [];
    let dataArchived = [];

    if (checkActive) {
      dataActive = fullData.filter((c) => c.active === checkActive);    
    } else if (checkInactive) {   
      dataInactive = fullData.filter((c) => !c.active === checkInactive);
    } else if (checkArchived) {   
      dataArchived = fullData.filter((c) => c.archived === checkArchived);
    }

    const newRowData = checkActive ? dataActive : checkInactive ? dataInactive : checkArchived ? dataArchived : fullData;
    this.props.dispatch(setListCategories(newRowData));
  };

  bulkUpdate = (selected) => {
    this.setState({
      modalCategoryMaster: true,
      optionToBulkUpdate: bulkUpdateOptions[selected],
    });
  };

  updateArchiveMasterCategory = () => {
    const { selectedMasterCategory } = this.state;
    const data = {
      masterCategoryId: selectedMasterCategory.id,
      isArchived: !selectedMasterCategory.archived,
    };
    this.props.dispatch(updateArchiveMasterCategory(data)).then((response) => {
      this.props.dispatch(getListCategories());
    });
  };

  handleClickOpen = (create = true) => {
    if (create) {
      this.setState({
        selectedMasterCategory: null
      })
    }
    hideButtonToSupport()
    this.setState({ openMasterCategorySideBar: true, updateOption: !create });
  };

  handleClickOpenModalUpdate = () => {
    hideButtonToSupport()
    this.setState({ openMasterCategorySideBar: true, updateOption: true});
  };

  handleClose = () => {
    showButtonToSupport()
    this.setState({
      openMasterCategorySideBar: false,
      selectedMasterCategory: null
    });
  };

  handleClickOpenAssignStores = (data) => {
    this.setState({
      selectedMasterCategory: data,
      openModalAssignStores: true
    });
  };

  handleCloseAssignStores = () => {
    this.setState({
      openModalAssignStores: false,
      selectedMasterCategory: null
    });
  };

  onFilterTextBoxChanged = (e) => {

    const term = e.target.value;
    const { masterCatalogReducer } = this.props;
    const { typeCategory = "master" } = this.state;
    const { filter = [] } = this.props.filter || {};

    this.setState({ term:term });
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!term) {
        this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeCategory, { term: "" }, { filter: filter.join() }))
      }

      if (term) {
        this.setState({
          timeout: setTimeout(() => {
            if (term) {
              this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeCategory, { term: term }, { filter: filter.join() }))
            }
          }, 500)
        })
      }
    }, 1500)
    
  }

  onFilterSwitchChanged = (state) => {
    const {typeCategory = "master", term} = this.state;
    let filterResult = state.map(filter => filter.value) || []
    this.setState({
        filter: filterResult
    })
    this.gridApi.setServerSideDatasource(this.serverSideDatasource(typeCategory, {term:term}, {filter: filterResult.join()}))
}

  handleCloseModalCategoryMaster = (update) => {
    this.setState({
      modalCategoryMaster: false,
    });
    if (update === true) {
      this.setState({
        selectedRows: [],
        optionToBulkUpdate: null,
      }, () => {
        this.handleDeactivateAdoptionMode()
      });
      this.props.dispatch(getListCategories());
    }
  };

  handleSelectChange = (value) => {
    this.setState({
      selectedView: value
    });
  }

  getViews = () => {
    getAgGridViewsAPI(catalogTestingViews.MASTER_CATEGORIES.value).then(res => {
      this.setState({
        views: res.values
      })
    })
  }

  handleCategoryFilterChange = (value) => {
    this.setState({
      typeCategory: value,
      selectedRows: [],
      selectedCategoryType: "",
      autoGroupColumnDef: {
        field: 'name',
        headerName: "Category Name",
        minWidth: 250,
        pinned: true,
        cellRendererParams: {
          innerRenderer: getCategoryNameRenderer(),
          checkEvent: this.handleCheck,
          menuEvent: this.handleMenu,
          adoptionMode: false,
          selectedRows: [],
          property: ""
        },
      }
    }, () => {
      this.processOnGrid();
    })
  }

  handleMenu = (image, data) => {
    let actions = [
      {key: "edit", value: "Edit"},
    ];
    if(data.parentCategoryId){
      actions.push({key: "makeOrphan", value: "Make Orphan"});
    }

    this.setState({
        anchorEl: image.currentTarget,
        categoryActions: actions,
        auxSelectedMasterCat: data
       //selectedMasterCategory: data,
    });
};

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
    this.closeConfirmationModal()
  };


  updateMasterCategory = (key) => {
    switch (key) {
      case "archive":
        this.updateArchiveMasterCategory();
        break;
      case "edit":
        this.handleClickOpen(false)
        break;
      case "makeOrphan":
        this.makeOrphan();
       break;
      default:
        break;
    }
    this.handleCloseMenu();
  };

  handleActionEvent = (key) => {
    let data = null
    switch (key) {   
      case "edit":
        this.setState({
          selectedMasterCategory: this.state.auxSelectedMasterCat
        })
        this.updateMasterCategory(key)
      break;
      case "makeOrphan":
        this.setState({
          selectedMasterCategory: this.state.auxSelectedMasterCat
        })
        data = {
          title: "Unlink from Parent",
          description: "Making it an Orphan keeps the Parent values. Updating will make it an Orphan, while not updating will keep as a Child."
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

  closeConfirmationModal = () => {
    this.setState({
        key: "",
        modalDetail: {},
        showModalConfirmation: false
    })
}

makeOrphan = () => {
  const {selectedMasterCategory} = this.state; 
  this.props.dispatch(unlinkCategoriesFromParent(selectedMasterCategory.id)).then(() => {
      this.props.dispatch(getMasterCategory(selectedMasterCategory.parentCategoryId)).then((mp) => {
          const resShopIds = mp.childCategories.map(category => category.shopId)
          const shopsSelected = resShopIds.filter(shopId => shopId !== selectedMasterCategory.shopId) || [];   
          
          if (mp.childCategories && mp.childCategories.length == 0) {
              const data = {
                  masterCategoryId: selectedMasterCategory.parentCategoryId,
                  isArchived: true
              }
              this.props.dispatch(updateArchiveMasterCategory(data)).then(() => {
                const newData = {...mp, shopIds: shopsSelected};
                this.props.dispatch(updateSingleMasterCategories(newData));
                  timeout = setTimeout(() => {
                    this.getAllMasterCategories();
                      clearTimeout(timeout)
                  }, 3000);
              });
          } else { 
            const newData = {...mp, shopIds: shopsSelected};   
            this.props.dispatch(updateSingleMasterCategories(newData));
            this.getAllMasterCategories();
          }
      });    
  })
};

getAllMasterCategories = () => {
  this.processOnGrid();
};

  handleCheck = (check, data) => {
    let result = [...this.state.selectedRows] || [];
    const { adoptionMode } = this.state
    let property = ""
    if (data.childCategories) {
      property = "parent"
    } else if (!data.parentCategoryId) {
      property = "orphan"
    } else {
      property = "child"
    }
    
    if (check.target.checked) {
      if (adoptionMode && property === "parent") {
        if (result.length > 0) {
          this.setState({
            autoGroupColumnDef: {
              field: 'name',
              headerName: "Category Name",
              minWidth: 250,
              pinned: true,
              cellRendererParams: {
                innerRenderer: getCategoryNameRenderer(),
                checkEvent: this.handleCheck,
                menuEvent: this.handleMenu,
                adoptionMode: adoptionMode,
                selectedRows: this.state.selectedRows,
                property: this.state.selectedCategoryType,
              },
            },
          }, () => {
            this.props.dispatch(
              openErrorMessage('Only one master category can be selected at a time.')
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
      selectedRows: result,
      selectedCategoryType: property,
      autoGroupColumnDef: {
        field: 'name',
        headerName: "Category Name",
        minWidth: 250,
        pinned: true,
        cellRendererParams: {
          innerRenderer: getCategoryNameRenderer(),
          checkEvent: this.handleCheck,
          menuEvent: this.handleMenu,
          adoptionMode: false,
          selectedRows: result,
          property: property
        },
      }
    }, () => {
      //TODO:
    });
  };

  //Reset column group
  handleAdoptionMode = () => {
    const { selectedRows, selectedCategoryType, adoptionMode } = this.state

    this.setState({
        adoptionMode: adoptionMode,
        autoGroupColumnDef: {
          field: 'name',
          headerName: "Category Name",
          minWidth: 250,
          pinned: true,
          cellRendererParams: {
              innerRenderer: getCategoryNameRenderer(),
              checkEvent: this.handleCheck,
              menuEvent: this.handleMenu,
              adoptionMode: adoptionMode,
              selectedRows: selectedRows,
              property: selectedCategoryType
          }
        }
    })
  }

  handleDeactivateAdoptionMode = () => {
      this.setState({
        selectedMasterCategory: null,
        typeCategory: "master",
        adoptionMode: false,
        autoGroupColumnDef: {
            field: 'name',
            headerName: "Name & Store",
            minWidth: 250,
            pinned: true,
            cellRendererParams: {
                innerRenderer: getCategoryNameRenderer(),
                checkEvent: this.handleCheck,
                menuEvent: this.handleMenu,
                adoptionMode: false,
                selectedRows: [],
                property: ""
            },
        },
        selectedRows: [],
        selectedCategoryType: ""
    })
      localStorage.removeItem("ADOPTION_MODE")
      localStorage.removeItem("ADOPTION_MODE_VERIFY")
  }

  handleCloseEverything = (update) => {
    this.handleDeactivateAdoptionMode();

    if(this.state.typeCategory == "master"){
      this.handleChangeTypeProduct("master")
    } else {
      this.handleChangeTypeProduct("orphan")
    }
  
    if (update) {
      this.processOnGrid();
    }
    this.setState({
      selectedMasterCategory: null
    })  
  }

  handleChangeTypeProduct = (value) =>{
    this.uncheckAllCheckboxes()
        
    this.setState({
        typeCategory: value,
        selectedRows: [],
        selectedCategoryType: "",
        autoGroupColumnDef: {
            field: 'name',
            headerName: "Name & Store",
            minWidth: 250,
            pinned: true,
            cellRendererParams: {
                innerRenderer: getCategoryNameRenderer(),
                checkEvent: this.handleCheck,
                menuEvent: this.handleMenu,
                adoptionMode: false,
                selectedRows: [],
                property: "",
            },
        }
    }, () => {
        this.processOnGrid();
    })
  }

  uncheckAllCheckboxes() {
    var checkboxes = document.querySelectorAll(".check-name");
    for (var checkbox of checkboxes) {
        checkbox.checked = false;
    }
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

  saveParentCategory = (category) => {  
    this.setState({
      selectedMasterCategory: category,
        autoGroupColumnDef: {
          field: 'name',
          headerName: "Category Name",
          minWidth: 250,
          pinned: true,
          cellRendererParams: {
              innerRenderer: getCategoryNameRenderer(),
              checkEvent: this.handleCheck,
              menuEvent: this.handleMenu,
              adoptionMode: true,
              selectedRows: this.state.selectedRows,
              property: "orphan",
          },
        },
    }) 
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

  render() {

    const { 
            checkActive, checkInactive, checkArchived, openMasterCategorySideBar, openModalAssignStores, 
            anchorEl, modalCategoryMaster, selectedCategoryType,
            selectedRows, optionToBulkUpdate, selectedView={}, views=[], updateOption,
            typeCategory, groupDefaultExpanded, serverSideStoreType, selectedMasterCategory, categoryActions, fullData, adoptionMode,
            filter, term, showModalConfirmation, key, modalDetail
          } = this.state;

    const { shopsList = {} } = this.props.shopReducer;

    const frameworkComponents = {  
      gridManageViewsPanel: GridManageViewsPanel,
      menuMoreActions: () => {
        return <MenuMoreActions 
          bulkUpdate={this.bulkUpdate}
          onRowSelected={this.onRowSelected}
          openModal={this.handleClickOpenModalUpdate}
          gridApi={this.gridApi}
        />
      },
      
    };
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={12}>
            <SearchBarConnect
              checkActive={checkActive}
              checkInactive={checkInactive}
              checkArchived={checkArchived}    
              handleChange={this.handleChange}
              handleFilterChange={this.onFilterSwitchChanged}
              buttonText={"New Category"}
              openModal={this.handleClickOpen}
              handleTermChange={this.onFilterTextBoxChanged}
              filter={filter}
              bulkUpdate={this.bulkUpdate}
              selectedCategories={selectedRows}
              processOnGrid={this.processOnGrid}
              term={term}
              hidden={true}
              getFilterOptions ={getFilterOptions}
              updateData={this.updateData}
              typeCategory={typeCategory}
              handleAdoptionMode={this.handleAdoptionMode}
              deactivateAdoptionMode={this.handleDeactivateAdoptionMode}
              closeEverything={this.handleCloseEverything}
              fullData={fullData || []}
              handleCategoryFilterChange={this.handleCategoryFilterChange}
              saveParentCategory={this.saveParentCategory}
              selectedParentCategory={this.state.selectedMasterCategory}
              selectedCategoryType={selectedCategoryType}
            />
          </Grid>
          <Grid item xs={12} container>
            <Grid className="labelField" item xs={6} sm={6} md={6} lg={2}>
              <p>
                {selectedRows && selectedRows.length || 0} {selectedCategoryType} categories selected
              </p>
            </Grid>
            {
              !adoptionMode &&
              <Grid className="editField" item xs={4} sm={4} md={2}>
                <EditableSelect
                  style={{ width: "20%" }}
                  name="type"
                  value={typeCategory}
                  valueToRender={typeCategory}
                  onChange={(event) => this.handleCategoryFilterChange(event.target.value)}
                  material={false}
                  editMode={true}
                >
                <MenuItem value="master">Master Categories</MenuItem>
                <MenuItem value="orphan">Orphan Categories</MenuItem>
                </EditableSelect>
              </Grid>
            }
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={12}>
              <div className="ag-theme-alpine container-aggrid" style={{height: "640px", marginBottom: "40px"}}>
                <AgGrid
                  columnDefs={this.state.columnDefs}     
                  defaultColDef={this.state.defaultColDef}
                  rowHeight={40}
                  autoGroupColumnDef={this.state.autoGroupColumnDef}         
                  frameworkComponents={frameworkComponents}
                  animateRows={true}
                  selectedView={selectedView}
                  views={views}        
                  onGridReady={this.onGridReady}
                  gridApi={this.gridApi}
                  updateListCategory={this.updateListCategory}
                  suppressRowClickSelection={false}
                  pagination={true}
                  paginationPageSize={this.state.paginationPageSize}
                  groupDefaultExpanded={groupDefaultExpanded}
                  treeData={true}
                  rowModelType={this.state.rowModelType}
                  cacheBlockSize={20}
                  maxBlocksInCache={20}
                  serverSideStoreType={serverSideStoreType}
                  isServerSideGroupOpenByDefault={this.state.isServerSideGroupOpenByDefault}
                  isServerSideGroup={this.state.isServerSideGroup}
                  getServerSideGroupKey={this.state.getServerSideGroupKey}
                  onRowSelected={this.onRowSelected}
                  sideBar = {{
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
                      }, 
                    ]
                  }}
                  onPaginationChanged={this.onPaginationChanged}
                  suppressPaginationPanel={true}
                />
                <div class="ag-paging-panel ag-unselectable pagination-position" id="ag-445" aria-live="polite" aria-describedby="ag-445-start-page ag-445-start-page-number ag-445-of-page ag-445-of-page-number ag-445-first-row ag-445-to ag-445-last-row ag-445-of ag-445-row-count">
                  <span class="ag-paging-row-summary-panel" aria-hidden="true">
                    <span id="ag-445-first-row" ref="lbFirstRowOnPage" class="ag-paging-row-summary-panel-number">0</span>
                    <span id="ag-445-to"> to </span>
                    <span id="ag-445-last-row" ref="lbLastRowOnPage" class="ag-paging-row-summary-panel-number">0</span>
                    <span id="ag-445-of"> of </span>
                    <span id="ag-445-row-count" ref="lbRecordCount" class="ag-paging-row-summary-panel-number">0</span>
                  </span>
                  <EditableTextField
                    placeholder={"Page"}
                    editMode={true}
                    material={false}
                    style={{maxWidth: "5em", margin: "unset"}}
                    onChange={(e) => this.onBtNumberPageChange(e)}
                    onKeyDown={(e) => this.onBtNumberPageKeyDown(e)}
                  />
                  <span class="ag-paging-page-summary-panel" role="presentation">
                    <div id="btFirst" ref="btFirst" class="ag-paging-button ag-disabled" role="button" aria-label="First Page" tabindex="0" aria-disabled="true"><span class="ag-icon ag-icon-first" unselectable="on" role="presentation"  onClick={() => this.onBtFirst()}></span></div>
                    <div id="btPrevious" ref="btPrevious" class="ag-paging-button ag-disabled" role="button" aria-label="Previous Page" tabindex="0" aria-disabled="true"><span class="ag-icon ag-icon-previous" unselectable="on" role="presentation" onClick={() => this.onBtPrevious()}></span></div>
                    <span class="ag-paging-description" aria-hidden="true">
                      <span id="ag-445-start-page">Page </span>
                      <span id="ag-445-start-page-number" ref="lbCurrent" class="ag-paging-number">0</span>
                      <span id="ag-445-of-page"> of </span>
                      <span id="ag-445-of-page-number" ref="lbTotal" class="ag-paging-number">0</span>
                    </span>
                    <div id="btNext" ref="btNext" class="ag-paging-button" role="button" aria-label="Next Page" tabindex="0" aria-disabled="false"><span class="ag-icon ag-icon-next" unselectable="on" role="presentation" onClick={() => this.onBtNext()}></span></div>
                    <div id="btLast" ref="btLast" class="ag-paging-button" role="button" aria-label="Last Page" tabindex="0" aria-disabled="false"><span class="ag-icon ag-icon-last" unselectable="on" role="presentation" onClick={() => this.onBtLast()}></span></div>
                  </span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        {   
          openMasterCategorySideBar ?
          <FormMasterCategory
          open={openMasterCategorySideBar}
          handleClose={this.handleClose}
          updateListCategory={this.updateListCategory}
          shop={shopsList && shopsList.values}
          category={selectedMasterCategory}
          typeCategory={typeCategory}
          updateOption={updateOption}
          sourceMapDefault={sourceMapDefault}
        /> :null
        }
       
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
            {categoryActions.map((option) => (
              <MenuItem
                key={option.key}
                onClick={() => this.handleActionEvent(option.key)}
              >
                {option.value}
              </MenuItem>
            ))}
          </Menu>
        
          <ModalUpdateMasterCategory
            open={modalCategoryMaster}
            handleClose={this.handleCloseModalCategoryMaster}
            masterCategories={selectedRows}
            optionToBulkUpdate={optionToBulkUpdate}
            updateListCategory={this.updateListCategory}
            typeCategory={typeCategory}
            processOnGrid={this.processOnGrid}
          />
          {
            openModalAssignStores && (
              <ModalAssignStores
                {...this.props}
                open={openModalAssignStores}
                masterCategory={selectedMasterCategory}
                shops={shopsList && shopsList.values}
                sourceMapDefault={sourceMapDefault}
                handleClose={this.handleCloseAssignStores}
                handleChange={this.handleChange}
                updateListCategory={this.updateListCategory}
            />    
            )
          }
      </React.Fragment>
    );
  }
}

const MasterCatalogWithTitle = ContainerWithTitle(
  MasterCatalog,
  "Master Categories"
);
const MasterCatalogConnected = connect(
  ({ dispatch, masterCatalogReducer, shopReducer, companyReducer }) => ({ dispatch, masterCatalogReducer, shopReducer, companyReducer })
)(MasterCatalogWithTitle);

export default MasterCatalogConnected;
