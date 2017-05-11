"use strict";
import React from 'react';
import electron from 'electron'
import styles from './styles.scss'

const link = "https://github.com/FakeEmperor";
const openLink = (link) => {
  var shell = require('electron').shell;
  //open links externally by default
  electron.shell.openExternal(link, {activate: true});


};
class Footer extends React.Component {
  render(){
    return(
      <div className={ styles.footer }>
        <p>With &#x2764; from
          <a onClick={ () => openLink(link) }>
            <img src="../assets/author.jpg" className={ styles.logo }/>
          </a>
          &
          <img src="../assets/logos/soundcloud.svg" className={ styles.soundcloud }/>
        </p>
        <i className="fa fa-shield"/>
      </div>
    )
  }

}

export default Footer
