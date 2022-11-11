import React from 'react';
import { Menu } from 'antd';
import Wheather from './Weather'
import { useSelector } from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  const user = useSelector(state => state.user)

  if (user.userData && !user.userData.isAuth){
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="weather">
    <Wheather/>
    </Menu.Item>  
  </Menu>
    )
  } else { 
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
}}

export default LeftMenu