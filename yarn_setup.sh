#!/bin/sh

cd catapult-sdk
yarn install
yarn run rebuild
cd ..

for module in 'discover' 'web'
do
	cd "${module}"
	yarn install
	cd ..
done
