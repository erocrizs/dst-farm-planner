'use strict';

const keys = {
  saveSummary: 'saveSummaries',
  saveData: 'saveData'
}

function saveJSON (key, json) {
  const toSave = JSON.stringify(json)
  localStorage.setItem(key, toSave)
}

function fetchJSON (key, defaultValue) {
  const raw = localStorage.getItem(key)

  if (!raw) {
    return defaultValue
  }

  return JSON.parse(raw)
}

export {saveJSON, fetchJSON, keys};
