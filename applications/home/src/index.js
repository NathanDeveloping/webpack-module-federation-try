
fetch('/config', {method: 'GET'}).then(configResp => {
    configResp.json().then(config => {
        console.log(config);
        window.checkoutAppUrl = config.checkoutAppUrl.public_url;
    
        window.searchAppUrl = config.searchAppUrl.public_url;
        
        window.homeAppUrl = config.homeAppUrl.public_url;
        
        import("./HomePage");
    })
})
