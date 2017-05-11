/**
 * Created by Raaw on 5/10/2017.
 */
"use strict";
import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';

const initOpts = {
  width: 640,
  height: 360
};

export function buildWindow() {
  return new BrowserWindow({
    show: false,
    width: initOpts.width,
    height: initOpts.height,
    frame: false,
    icon: path.join(__dirname, '../assets/icons/app/128x128.png'),
  });
}

export function main (app, window) {
  const exampleBook = fs.readFileSync('./assets/Дюна.fb2', "utf8");
  //console.log(exampleBook)
}
