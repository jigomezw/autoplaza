const axios = require('axios').default
var fs = require('fs')

async function getBrands() {
	try {
		const response = await axios.get('https://frontend.mercadolibre.com/sites/MLM/homes/motors/filters', {
			params: {
				nc: 2504116699,
				version: 'motors',
				category: 'MLM1763',
				os: 'web'
			}
		})
		// console.log(response.data.available_filters[0].values)
		return response.data.available_filters[0].values || []
	} catch (error) {
		console.error(error)
	}
}

async function getModels(brandId) {
	try {
		const response = await axios.get('https://frontend.mercadolibre.com/sites/MLM/homes/motors/filters', {
			params: {
				nc: 4991058420,
				version: 'motors',
				category: 'MLM1763',
				os: 'web',
				BRAND: brandId
			}
		})
		return response.data.available_filters[0].id == 'MODEL' ? response.data.available_filters[0].values || [] : []
	} catch (error) {
		console.error(error)
	}
}

getBrands().then((brands) => {
	// console.log('getBrands-->', brands)
	if (brands && brands.length) {
		brands.map((brand, index) => {
			// console.log('brand-->', brand)
			getModels(brand.id).then((models) => {
				if (models && models.length) {
					console.log('getModels-->', models)
					let fileName = `${brand.id}-${brand.name}.json`
					fs.writeFile(`data/${fileName}`, JSON.stringify(models), function (err) {
						if (err) throw err
						console.log(`File ${fileName} is created successfully.`)
					})
				}
			})
		})
	}
})
