# Part Placer

> Generate cut lists automatically!

This is a React app for generating a material cutlist based on a list of raw materials and the parts which should be cut out of each.

No backend is required - any static host will do. This application is PWA enabled - hosting on https is a requirement for enabling that functionality.

Application state is saved to localstorage for persistence between site visits.

Application includes Sentry for error tracking.

## Development

1. Clone repo
2. run `npm install`
3. run `npm start`

### Create Icons

```bash
rsvg-convert -h 192 assets/saw.svg > public/logo192.png
rsvg-convert -h 512 assets/saw.svg > public/logo512.png
rsvg-convert -h 128 assets/saw.svg > public/favicon.ico
```
