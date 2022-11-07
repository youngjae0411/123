import React from 'react';
import { Menu } from 'antd';
import Wheather from './Weather'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    <Menu.Item key="subscription">
      <a href='/subscription'>Follow</a>
    </Menu.Item>  
    <Menu.Item key="weather">
    <Wheather/>
    </Menu.Item>  
  </Menu>
  )
}

export default LeftMenu