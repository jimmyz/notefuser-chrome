notefuser-chrome
================

This is the Chrome extension that powers NoteFuser. 

h2. About NoteFuser

NoteFuser is a simple app that allows users to easily link Evernote notes to person records on new.FamilySearch.org and geni.com. It was primarily built as a proof of concept for the RootsTech 2012 Developer Challenge. It is being released as open source so that any interested parties can take the next step.

The project is broken into two packages notefuser-chrome and notefuser-server.

h2. About notefuser-chrome

The notefuser-chrome repository contains the code to inject elements onto the FamilySearch and Geni pages. It should be packaged as a Google Chrome plugin. It has never been released to the chrome store.

h2. About notefuser-server

The notefuser-server connects is necessary to connect to the Evernote API for reading and writing notes. At the time that this was written, there was no JavaScript API for reading and writing to the API, so the Ruby SDK was used to process information server to server. 

Note: new.familysearch.org has been deprecated to a read-only state and shouldn't really be used anymore.
