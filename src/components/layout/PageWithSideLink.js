import React, { PureComponent } from 'react';

import {
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

export default class PageWithSideLink extends PureComponent {
    state = {
        selectedTabIndex: 0
    }

    selectTab = selectedTabIndex => e => {
        this.setState({
            selectedTabIndex
        })
    }

    render () {

        const { selectedTabIndex } = this.state;
        const { componentList } = this.props;

        const selectedTab = componentList[selectedTabIndex]

        return (
            <Grid container>
                <Grid item xs={12} sm={3} md={3}>
                    <List style={{
                        backgroundColor: '#efefef'
                    }}>
                        {
                            componentList.map(
                                (sideLink, index) => {

                                    const isSelected = selectedTabIndex == index;

                                    return (
                                        <ListItem button onClick={this.selectTab(index)} style={isSelected ? {backgroundColor: '#1cc4e8', transition: 'all 0.6s'} : {transition: 'all 0.6s'}}>
                                            <ListItemIcon>
                                                <i style={isSelected ? {color: 'white'} : {}} className="material-icons">
                                                    {sideLink.icon}
                                                </i>
                                            </ListItemIcon>
                                            <p style={isSelected ? {color: 'white', fontWeight: 'bold'} : {}}>{sideLink.name}</p>
                                        </ListItem>
                                    )
                                }
                            )
                        }
                    </List>
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                    {selectedTab.component}
                </Grid>
            </Grid>
        )
    }
}