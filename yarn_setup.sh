#!/bin/sh

cd catapult-sdk
yarn install
yarn run rebuild
cd ..

for module in 'add-peers-info' 'discover-peers' 'web'
do
	cd "${module}"
	yarn install
	cd ..
done
