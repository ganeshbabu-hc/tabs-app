import React, { useState, createRef, useEffect } from 'react';
import TabPane from "./TabsPane";
import IconLeftChevron from '../dist/icons/chevron-left.png';
import IconRightChevron from '../dist/icons/chevron-right.png';
import IconClose from '../dist/icons/close.png';
import IconAdd from '../dist/icons/add.png';

const intialState = {
  selectedTab: 0,
  tabs: [{ name: 'Tab 1', pane: 'Tab 1 content', closable: false },
   { name: 'Tab 2', pane: 'Tab 2 content', closable: true }, 
   { name: 'Tab 3', pane: 'Tab 3 content', closable: true }]
}
const Tabs =  ({tabLimit, tabWidth}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabCount, setTabCount] = useState(intialState.tabs.length);
  const [tabs, setTabs] = useState(intialState.tabs);
  const [alertVisible, setAlertVisible] = useState(false);
  const [hideLeftArrow, sethideLeftArrow] = useState(true);
  const [hideRightArrow, sethideRightArrow] = useState(true);
  const [widthOverFlow, setWidthOverflow] = useState(false);
  const tabPane = createRef(null);

  //look for the tab changes
  useEffect(()=>{
    setTabContainer();
  },[tabs]);

  //add new tab
  const addNewTab = () => {
    let tabsLength = tabs.length;
    //limit to 10 tabs
    if(tabsLength < tabLimit ) {
      let newTabs = [...tabs];
      newTabs.push({
        name: `Tab ${tabCount+1}`, 
        pane: `Tab content ${tabCount+1}`,
        closable: true
      });

      //add new tab
      setTabs(newTabs);
      //update the total tab count for 
      setTabCount(tabCount + 1);
    }
    // setTabContainer();
  }


  //remove existing tab
  const removeTab = (e, tabId) => {
    
    //avoid event bubbling to tab-item
    e.stopPropagation();

    let updatedTabs = [...tabs];
    updatedTabs.splice([tabId],1);

    // if the active tab is removed then change the active tab previous one
    if(tabId === selectedTab) {
      let newTabIndex = selectedTab - 1;
      setSelectedTab(newTabIndex);
    }
    // update the new tab
    setTabs(updatedTabs);

    //set tab alert
    setTabAlert();
  }

  const setTabAlert = () =>{
    setAlertVisible(true);
    setTimeout(()=>{
      setAlertVisible(false);
    },3000);
  }
  const handleArrowHide = (tabId)=>{
    if(!widthOverFlow) {
      return;
    }
    //hide arrow for the fisrt and last tab
    if(tabId === tabs.length-1) {
      sethideRightArrow(false)
    } else if(tabId === 0) {
      sethideLeftArrow(false);
    }
  }

  const handleArrowUnHide = (tabId)=>{

    if(!widthOverFlow) {
      return;
    }
    //show the arrow
    if(tabId === tabs.length-1) {
      sethideRightArrow(true)
    } else if(tabId === 0) {
      sethideLeftArrow(true);
    }
  }
  const scroll = (scrollOffset) => {
    tabPane.current.scrollLeft += scrollOffset;
  };

  const setTabContainer = () => {

    //show the side nav buttons if the width of tab overflows
    let tabContainerWidth = tabPane.current.offsetWidth;
    let totalTabsWidth = tabs.length * tabWidth;
    if(totalTabsWidth < tabContainerWidth) {
      setWidthOverflow(false)
    } else {
      setWidthOverflow(true);
    }
  }

  const showArrow = (widthOverFlow, hideNav) => {
  
    // show/hide the arrows based on the selected tab
    return ((!widthOverFlow && hideNav) || !hideNav);
  }
  return(
    <React.Fragment>
      <div className="tabs">
        <button className={`btn-nav ${ showArrow(widthOverFlow, hideLeftArrow) ? 'hide-btn' : ''}`} onClick={() => scroll(-tabWidth)}><img src={IconLeftChevron} alt="left_chev"/></button>
        <div ref={tabPane} className="tab-item-container"> 
          {tabs.map((tab, index) => {
            return (
            <div className={`tab-item ${( selectedTab === index ) ? 'active' : '' }`} draggable="true" onMouseLeave={()=>{
                handleArrowUnHide(index);
              }} onMouseOver={()=>{
                handleArrowHide(index);
              }} onClick={() => setSelectedTab(index)}>{tab.name}
              {tab.closable && <button className="remove-btn" onClick={(e) => removeTab(e, index)}><img src={IconClose} alt="left_chev" /></button>}
            </div>)
          })}
         </div>
        <button className={`btn-nav ${ showArrow(widthOverFlow, hideRightArrow) ? 'hide-btn' : ''}`} onClick={() => scroll(tabWidth)} ><img src={IconRightChevron} alt="left_chev" /></button>
        <button className="btn-nav" disabled={tabs.length > 10} onClick={() => addNewTab()} ><img src={IconAdd} alt="left_add" /></button>
      </div>
      <div className="tab-pane-container">
        <TabPane>
          {tabs[selectedTab] && <h1>{tabs[selectedTab].pane}</h1>}
        </TabPane>
      </div>
      { alertVisible && <div className="alert">
        Tab removed
      </div> }
    </React.Fragment>
  )
}


export default Tabs;