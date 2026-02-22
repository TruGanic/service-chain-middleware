# PM2 Deployment Notes (Server)

## 1) Install PM2
- npm i -g pm2
- pm2 -v

## 2) Build the app
- cd /home/debian/food-supply-chain/service-chain-middleware
- npm ci
- npm run build

## 3) Start all environments with PM2
- pm2 start npm --name farmer -- run start:farmer
- pm2 start npm --name transporter -- run start:transporter
- pm2 start npm --name retailer -- run start:retailer

## 4) Check status and logs
- pm2 status
- pm2 logs farmer
- pm2 logs transporter
- pm2 logs retailer

## 5) Enable auto-start on reboot
- pm2 startup
- sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u debian --hp /home/debian
- pm2 save

## 6) Deploy updates (after code changes)
- cd /home/debian/food-supply-chain/service-chain-middleware
- npm run build
- pm2 restart farmer transporter retailer

## 7) Stop or remove processes (optional)
- pm2 stop farmer transporter retailer
- pm2 delete farmer transporter retailer

## Notes
- Each process loads a different env file via its npm script:
  - start:farmer -> .env.farmer
  - start:transporter -> .env.transporter
  - start:retailer -> .env.retailer
- Ensure each .env file uses a different PORT to avoid conflicts.
