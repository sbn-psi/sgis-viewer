import { ChevronLeft, ChevronRight, ChevronRightTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { TreeItem, TreeItemContentProps, TreeItemProps, TreeView, useTreeItem } from '@mui/lab';
import { Drawer, IconButton, styled, Typography } from '@mui/material';
import clsx from 'clsx';
import { forwardRef, useState } from 'react';
import { Zone } from '../AppState';
import { useAppState, useAppStateDispatch } from '../AppStateContext';

const drawerWidth = 240;

export default function LayerNavigator({open, close}: {open: boolean, close: () => void}) {
  const dispatchState = useAppStateDispatch()
  const state = useAppState()

  return <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
      },
    }}
    variant="persistent"
    anchor="left"
    open={open}
  >
    <DrawerHeader>
      <IconButton onClick={close}>
        <ChevronLeft />
      </IconButton>
    </DrawerHeader>
    <TreeView
      defaultCollapseIcon={<ExpandMoreTwoTone/>}
      defaultExpandIcon={<ChevronRightTwoTone/>}
      defaultExpanded={['Overview']}
      onNodeSelect={
        (event: React.SyntheticEvent, nodeIds: string[]) => {
          const nodeId = nodeIds[0]
          if(nodeId === 'Overview') {
            dispatchState({type: 'UNSELECTED_ZONE'})
          } else {
            dispatchState({type: 'SELECTED_ZONE', zone: state.zones[parseInt(nodeId)]})
          }
        }
      }>
        <CustomTreeItem nodeId="Overview" label="Overview">
          {state.zones.map((zone: Zone, index: number) => {
            return <CustomTreeItem key={index} nodeId={index.toString()} label={zone.name} />
          })}
        </CustomTreeItem>
    </TreeView>
  </Drawer>
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const CustomContent = forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

function CustomTreeItem(props: TreeItemProps) {
  return <TreeItem ContentComponent={CustomContent} {...props} />;
}