import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';

export default class ExpandableListItem extends PureComponent {

    onItemClick = (item, parentItem) => e => {
        this.props.onItemClick(item, parentItem)
    }

    render () {

        const {
            item = {},
            isOpen = false,
            currentUrl,
            currentRoute,
            goToPage,
            ...restProps
        } = this.props;

        const {
            childrenList = [] 
        } = item;

        const Icon = !item.customIcon && item.icon || 'span';

        return (
            <Fragment>
                {item.url==='switch'?<ListItem {...restProps} style={{
                    cursor: 'pointer'
                }} onClick={() => goToPage('switch')}>
                    <ListItemIcon>
                        <Icon 
                            style={{
                                color: 'black'
                            }}
                        />
                    </ListItemIcon>
                    <div className="menus-heading" data-cy={"lbl-"+(item.title).replace(/\s+/g, '')}
                    >{item.title}</div>
                </ListItem>:
                <ListItem {...restProps} style={{
                    cursor: 'pointer'
                }}>
                    <ListItemIcon>
                        {Boolean(item.customIcon) ?
                         <img src={item.icon} width='24' height='24'/> 
                        : <Icon 
                            style={{
                                color: 'black'
                            }}
                        />}
                    </ListItemIcon>
                    <div className="menus-heading" data-cy={"lbl-"+(item.title).replace(/\s+/g, '')}
                    >{item.title}</div>
                </ListItem>}
                {childrenList.length?<Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            childrenList.map(
                                (link, index) => {
                                    const isActive = link.url === currentRoute && item.url === currentUrl;
                                    const Icon = link.icon;
                                    return (
                                        <Link data-cy={"lnk-"+(link.title).replace(/\s+/g, '')} key={index} className="striped-link" to={`/settings/${item.url}/${link.url}`}><ListItem className={`nav_list_item ${isActive ? 'active' : ''}`} button key={index} onClick={this.onItemClick(link, item)}>
                                            
                                            <ListItemIcon style={{
                                                paddingLeft: 10
                                            }}>
                                                {link.icon ? <Icon 
                                                    title={link.title}
                                                    active={isActive}
                                                /> : <MenuIcon />}
                                            </ListItemIcon>
                                            <ListItemText inset primary={link.title} />
                                            
                                        </ListItem></Link>
                                    )
                                }
                            )
                        }
                    </List>
                </Collapse>:null}
            </Fragment>
        )
    }

}