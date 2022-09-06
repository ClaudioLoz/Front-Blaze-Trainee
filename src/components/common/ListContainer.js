import React from 'react'
import { Grid, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination,
    IconButton, withStyles, TableSortLabel, Tooltip } from '@material-ui/core';
import SearchField from './SearchField'
import PropTypes from 'prop-types';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const ListContainer = (props) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');

    var rowsPerPageOptions = [10, 25, 50, 100];

    const handleChangePage = (event, page) => {
        setPage(page);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    };
    
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc' ? (a, b) => descendingComparator(a, b, (orderBy == "clockInTime" ? "timestampClockInTime" : orderBy == "invitedDate" ? "created" : orderBy)) : 
            (a, b) => -descendingComparator(a, b, (orderBy == "clockInTime" ? "timestampClockInTime" : orderBy == "invitedDate" ? "created" : orderBy));
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    
    return (
        <div className="list-container">
            {!props.hide && <Grid container>
                <SearchField onChange={props.onChangeTerm} value={props.term} onSearch={props.onSearch} />
            </Grid>}
            <Grid container>
                <Grid className="unversalScroll" item xs={12} sm={12} md={12} lg={12}>
                    <div className="table-scroll cus-pager-top">
                        <Paper className="paper-page">
                            <Table>
                                {!props.isSectionEmployees ?
                                <TableHead>
                                    {props.columns && props.columns.map((col,index) => <TableCell key={index}>{col}</TableCell>)}
                                    </TableHead> :
                                    <SortTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        columns={props.columns}
                                        {...props}
                                    />
                                }
                                {!props.isSectionEmployees ? 
                                    <TableBody>
                                        {props.list && props.list.length > 0 &&
                                            props.list.map((info) => <ListItem key={info.id} fields={props.fields} info={info} props={props} {...props} />)
                                        }
                                    </TableBody> : 
                                    <TableBody>
                                        {props.list && props.list.length > 0 &&
                                            stableSort(props.list, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((info) => <ListItem key={info.id} columns={props.columns} info={info} props={props} {...props} />)
                                        }
                                    </TableBody>
                                }
                                {props.isSectionEmployees ?                                
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                colSpan={9}
                                                count={props.list.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onChangePage={handleChangePage}
                                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActionsWrapped}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                            />
                                        </TableRow>
                                    </TableFooter> : null}
                            </Table>
                            {props.list && !(props.list.length > 0) && <span className="list-container-empty">No Information available.</span>}
                        </Paper>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

ListContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default ListContainer;


const ListItem = ({ columns, fields, info, actionText, onClick, onClickRow = () => { }, props }) => {
    return (
        <TableRow onClick={() => onClickRow(info.id)}>
        {props.isSectionEmployees ?
            columns && columns.map((col,index) =>
                col.id === 'action' ? <TableCell key={index} id="custom-table-sort-column">
                    <Button className="primary-button" onClick={() => onClick(info.id)}>{actionText}</Button>
                </TableCell> : <TableCell key={index} id="custom-table-sort-column">{info[col.id]}</TableCell>) :
            fields && fields.map((col,index) => 
                col === 'action' ? <TableCell key={index}>
                    <Button className="primary-button" onClick={() => onClick(info.id)}>{actionText}</Button>
                </TableCell> : <TableCell key={index}>{info[col]}</TableCell>)}
        </TableRow>
    )
}

const SortTableHead = ({ columns, order, orderBy, onRequestSort }) => {   
    let noSortColumns = ["action", "empId"];
    const createSortHandler = (property) => (event) => {
        if (!noSortColumns.includes(property)) {
            onRequestSort(event, property);
        }
    };
    
    return (
        <TableHead>
            <TableRow>
                {columns && columns.map((col,index) => 
                    <TableCell key={index}>
                        {!noSortColumns.includes(col.id) ? 
                            <Tooltip title="Click to sort" placement="top-start">
                                <TableSortLabel
                                    active={orderBy === col.id}
                                    direction={orderBy === col.id ? order : 'asc'}
                                    onClick={createSortHandler(col.id)}
                                >
                                    {col.label}
                                </TableSortLabel>   
                            </Tooltip> :
                                <TableHead style={{fontSize:"17px"}}>
                                    {col.label}
                                </TableHead>
                        }
                    </TableCell>
                )}
            </TableRow>
      </TableHead>
    )
}

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    },
});


const TablePaginationActions = (props) => {

    const handleFirstPageButtonClick = event => {
        props.onChangePage(event, 0);
    };

    const handleBackButtonClick = event => {
        props.onChangePage(event, props.page - 1);
    };

    const handleNextButtonClick = event => {
        props.onChangePage(event, props.page + 1);
    };

    const handleLastPageButtonClick = event => {
        props.onChangePage(
            event,
            Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1),
        );
    };

    return (
        <div className={props.classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={props.page === 0}
                aria-label="First Page"
            >
                {props.theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={props.page === 0}
                aria-label="Previous Page"
            >
                {props.theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={props.page >= Math.ceil(props.count / props.rowsPerPage) - 1}
                aria-label="Next Page"
            >
                {props.theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={props.page >= Math.ceil(props.count / props.rowsPerPage) - 1}
                aria-label="Last Page"
            >
                {props.theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);