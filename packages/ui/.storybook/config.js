import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import backgrounds from "@storybook/addon-backgrounds"
import {radiantGraphite} from '../src/theme.js'
import './../src/index.css'
import './../src/fonts/fonts.css'

const componentStories = require.context(
  './../src',
  true,
  /.stories.js$/,
)

const loadStories = () => {
  componentStories.keys().forEach(componentStories)
}

addDecorator(backgrounds([
  { name: 'dark', value: radiantGraphite, default: true },  { name: 'red', value: 'red'},

]))

configure(loadStories, module)
