function defineEventAttributes(Class, eventTypes) {
	let onEventTypes = eventTypes.map(type => 'on' + type);
	eventTypes.forEach(type => {
		const symbol = Symbol();
		Object.defineProperty(Class.prototype, 'on' + type, {
			get: function() {
				return this[symbol] || null;
			},
			set: function(callback) {
				this[symbol] && this.removeEventListener(type, this[symbol]);
				this[symbol] = typeof callback == 'function' ? callback : null;
				this[symbol] && this.addEventListener(type, this[symbol]);
			},
			enumerable: false,
		});
	});

	let superObservedAttributes = Class.observedAttributes;
	if ('observedAttributes' in Class) {
		// If the element definition filters the set of observed attributes so that it only reports
		// on a specific subset of them, we’ll obviously need to add our on* attributes.
		Object.defineProperty(Class, 'observedAttributes', {
			value: superObservedAttributes.concat(onEventTypes),
		});
	}

	let superACC = Class.prototype.attributeChangedCallback;
	Object.defineProperty(Class.prototype, 'attributeChangedCallback', {
		value: function attributeChangedCallback(name, oldValue, newValue) {
			if (onEventTypes.indexOf(name) != -1) {
				// It's one of our events, so we handle it.
				let callback;
				if (newValue != null) {
					try {
						callback = Function('event', newValue);
					} catch (e) {
						// Browsers tend to show an error in the console, but it's not
						// thrown from this context; the property access returns null.
						// I wonder, would setTimeout(function() { throw e; }, 0) be better?
						window.console && console.error && console.error(e);
					}
				}
				this[name] = callback;
			}
			if (!superObservedAttributes || superObservedAttributes.indexOf(name)) {
				// The real attributeChangedCallback wants this attribute.
				// (Note that it may be one of our events too; that’s OK.)
				superACC && superACC.apply(this, arguments);
			}
		},
		enumerable: false,
	});

	// Custom Events V1 has attributeChangedCallback being called for all suitable attributes on
	// upgrade, so we don’t need to do anything for it. Custom Elements V0 (which is what polyfills
	// like webcomponents.js polyfill at the time of writing) doesn’t, so it needs createdCallback
	// to be set to hook up the events initially. (V1 uses constructor instead of createdCallback,
	// so this change should be harmless.)
	let superCC = Class.prototype.createdCallback;
	Object.defineProperty(Class.prototype, 'createdCallback', {
		value: function createdCallback() {
			superCC && superCC.apply(this, arguments);
			for (let type of eventTypes) {
				let name = 'on' + type,
					value = this.getAttribute(name);
				if (value != null) {
					this.attributeChangedCallback(name, null, value);
				}
			}
		},
		enumerable: false,
	});
}
