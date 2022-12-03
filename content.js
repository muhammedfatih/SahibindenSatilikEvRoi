 if (window.location.href.indexOf("sahibinden.com/ilan/") > -1) {
    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits:0,
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
    //message listener for background
    chrome.runtime.onMessage.addListener(function(request) {
    });

    //on init perform based on chrome stroage value
    window.onload=function(){  
        chrome.storage.sync.get('active', function(data) {
            if(data.active){
                const pricesRegexp = /\<span\> (.*?) TL\</gm;

                let categories = []
                const breadcrumbItems = document.getElementsByClassName('breadcrumbItem')
                for(let i = 1 ; i < breadcrumbItems.length; i++ ){
                    categories.push(breadcrumbItems[i].innerText)
                }
                const price = $('.classifiedInfo')[0].children[0].innerText.split(' ')[0].replaceAll('.','')

                if(
                    (categories[0] === 'Emlak' && categories[1] === 'Bina') ||
                    (categories[0] === 'Konut' && categories[2] === 'Satılık Daire')
                )
                {
                    let details = {}
                    const classifiedInfoList = document.getElementsByClassName('classifiedInfoList')[0].children
                    for(const element of classifiedInfoList){
                        const parts = element.innerText.split(/\n/);
                        details[parts[0]] = parts[2];
                    }

                    const locations = document.getElementsByTagName('h2')[2].innerText.replaceAll('İ', 'i').toLowerCase().split(' / ');
                    const location = locations.join('-')
                        .replaceAll('ı', 'i')
                        .replaceAll('ğ', 'g')
                        .replaceAll('ü', 'u')
                        .replaceAll('ş', 's')
                        .replaceAll('ö', 'o')
                        .replaceAll('ç', 'c')
                        .replaceAll(' ', '-')

                    let redirectUrl = 'https://www.sahibinden.com/kiralik-'+categories[1].toLowerCase()+'/'+location;
                    if(categories[2] === 'Satılık Daire'){
                        redirectUrl = 'https://www.sahibinden.com/kiralik-daire/'+location;
                    }

                    if(categories[1] === 'Bina' || categories[2] === 'Satılık Daire'){
                        $.ajax({
                            url:redirectUrl,
                            type:'GET',
                            success: function(data){
                                let prices = [];
                                let averageExact = 0;
                                const matches = [...data.matchAll(pricesRegexp)];
                                for(const element of matches){
                                    prices.push(element[1].replaceAll('.', ''))
                                    averageExact +=  element[1].replaceAll('.', '') / matches.length
                                }
                                let redirectUrl1 = 'https://www.sahibinden.com/kiralik-daire/'+location+'?a20=38473';
                                let redirectUrl2 = 'https://www.sahibinden.com/kiralik-daire/'+location+'?a20=38470';
                                let redirectUrl3 = 'https://www.sahibinden.com/kiralik-daire/'+location+'?a20=38474';

                                $('.classifiedInfoList').prepend('<li><strong>Ortalama Kira</strong><span>'+formatter.format(averageExact)+'<br/>('+prices.length+' ilan/'+Math.ceil(price/averageExact)+' ay/'+Math.ceil(Math.ceil(price/averageExact)/12)+' yıl)</span><li>')

                                $.ajax({
                                    url:redirectUrl1,
                                    type:'GET',
                                    success: function(data){
                                        let pricesSub = [];
                                        let averageExactSub = 0;
                                        const matches = [...data.matchAll(pricesRegexp)];
                                        for(const element of matches){
                                            pricesSub.push(element[1].replaceAll('.', ''))
                                            averageExactSub +=  element[1].replaceAll('.', '') / matches.length
                                        }
                                        $('.classifiedInfoList').prepend('<li><strong>Ortalama 1+1 Kirası</strong><span>'+formatter.format(averageExactSub)+'<br/>('+pricesSub.length+' ilan/'+Math.ceil(price/averageExactSub)+' ay/'+Math.ceil(Math.ceil(price/averageExactSub)/12)+' yıl)</span><li>')
                                    }
                                });
                                $.ajax({
                                    url:redirectUrl2,
                                    type:'GET',
                                    success: function(data){
                                        let pricesSub = [];
                                        let averageExactSub = 0;
                                        const matches = [...data.matchAll(pricesRegexp)];
                                        for(const element of matches){
                                            pricesSub.push(element[1].replaceAll('.', ''))
                                            averageExactSub +=  element[1].replaceAll('.', '') / matches.length
                                        }
                                        $('.classifiedInfoList').prepend('<li><strong>Ortalama 2+1 Kirası</strong><span>'+formatter.format(averageExactSub)+'<br/>('+pricesSub.length+' ilan/'+Math.ceil(price/averageExactSub)+' ay/'+Math.ceil(Math.ceil(price/averageExactSub)/12)+' yıl)</span><li>')
                                    }
                                });
                                $.ajax({
                                    url:redirectUrl3,
                                    type:'GET',
                                    success: function(data){
                                        let pricesSub = [];
                                        let averageExactSub = 0;
                                        const matches = [...data.matchAll(pricesRegexp)];
                                        for(const element of matches){
                                            pricesSub.push(element[1].replaceAll('.', ''))
                                            averageExactSub +=  element[1].replaceAll('.', '') / matches.length
                                        }
                                        $('.classifiedInfoList').prepend('<li><strong>Ortalama 3+1 Kirası</strong><span>'+formatter.format(averageExactSub)+'<br/>('+pricesSub.length+' ilan/'+Math.ceil(price/averageExactSub)+' ay/'+Math.ceil(Math.ceil(price/averageExactSub)/12)+' yıl)</span><li>')
                                    }
                                });
                            } 
                        });
                    }
                }
            }
        });
    }
}

