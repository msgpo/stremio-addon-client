var AddonClient = require('./AddonClient')
var fromDescriptor = require('./fromDescriptor')
var INSTANCE_MSG = 'instance of AddonClient required'

function AddonCollection(addons) {
	var handle = this
	
	addons = Array.isArray(addons) ? addons : []

	handle.getAddons = function() {
		return addons.slice()
	}
	
	handle.load = function(all) {
		addons = all.map(fromDescriptor)
	}

	handle.save = function() {
		return addons.map(function(x) { return x.toDescriptor() })
	}

	handle.includes = function(addon) {
		if (!addon instanceof AddonClient) throw new Error(INSTANCE_MSG)
		return addons.some(function(x) { return x.transportUrl === addon.transportUrl })
	}

	handle.add = function(addon) {
		if (!addon instanceof AddonClient) throw new Error(INSTANCE_MSG)
		if (!handle.includes(addon)) addons.push(addon)
	}

	handle.remove = function(addon) {
		if (!addon instanceof AddonClient) throw new Error(INSTANCE_MSG)
		addons = addons.filter(function(x) { return x.transportUrl != addon.transportUrl })
	}

	// Create a copy of the collection without deep-copying the add-ons
	handle.clone = function() {
		var col = new AddonCollection(addons.slice())
		return col
	}

	return handle
}

module.exports = AddonCollection
