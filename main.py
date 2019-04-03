#! /usr/bin/env python3

import ssl
ssl.match_hostname = lambda cert, hostname: True # monkey patch :()-[--[

import requests as r
import json

key = "721d9481-6403-515d-a230-7c31566e33ab"

headers = {
		'x-api-key':key,
		'Content-Type':'application/json'
	}
try:
	data = r.get("https://localhost:8443/user/whoami", headers = headers)
	print('resp: ', data.text)
except:
	print('error')
