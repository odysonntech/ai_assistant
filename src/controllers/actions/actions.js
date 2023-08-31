import http from 'https'
import axios from 'axios'


const actionsCtrl={};

actionsCtrl.WebSearchScraping=async(search)=>{

    /*const req = http.request('https://www.google.com/search?q='+search, res => {
        const data = [];
        res.on('data', _ => data.push(_))
        res.on('end', () => console.log(data.join()))
    });

    req.end();*/
    try {
		const response = await axios.get(
			'https://www.google.com/search?q='+search
		)
		console.log(response)
	} catch (error) {
		console.error(error)
	}
	
}

export default actionsCtrl;