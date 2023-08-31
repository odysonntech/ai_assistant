import config from '../config.js'
import actionsCtrl from './actions/actions.js';
import { pipeline } from '@xenova/transformers';
import { HfInference } from "@huggingface/inference";
/*import { HfAgent } from "@huggingface/agents";
import { createRepo, commit, deleteRepo, listFiles } from "@huggingface/hub";
import { RepoId, Credentials } from "@huggingface/hub";*/
import { dockStart } from '@nlpjs/basic';
import { NlpManager } from 'node-nlp';
import fs from 'fs';

const HF_ACCESS_TOKEN = config.HF_KEY__WRITE;

const hf = new HfInference(HF_ACCESS_TOKEN);
//Xenova/LaMini-Flan-T5-783M
//f"Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\n{instruction}\n\n### Response:"
let poet = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
let translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');

const indexCtrl={};

indexCtrl.renderIndex=(req,res)=>{
    return res.render('index');
}

indexCtrl.chat=async (req,res)=>{
try {

    //actionsCtrl.WebSearchScraping(req.body.prompt)

    //console.log(req.body.prompt)

    let quest = await translator(req.body.prompt, {
        src_lang: 'spa_Latn',
        tgt_lang: 'eng_Latn'
    });

    let action=await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: [quest[0].translation_text],
        parameters: { candidate_labels: ['question','dialog', 'image generated', 'code generated','music generated','summary generator'] }
      })

    console.log(action[0].labels,action[0])

    if(action[0].labels[0]=='question'){
        const nlp = new NlpManager({ languages: ['es'], nlu: { useNoneFeature: false } });
        const data = fs.readFileSync('model.nlp', 'utf8');
        nlp.import(data);
        const response = await nlp.process('es', req.body.prompt);
        let respuesta=response.answer
        if(response.answer==undefined){
            const array=[
                'Disculpa, no entendi',
                'No tengo una respuesta para tu pregunta',
                'No poseo el conocimiento para contestar tu pregunta',
                'No entiendo tu pregunta',
                'No entiendi tu pregunta',
                'Lo siento, me gustaria ayudarte pero por ahora no puedo',
                'Lo siento, no puedo ayudarte por ahora',
                'Aun sigo aprendiendo, me disculpo por no poder ayudarte',
                'No puedo ayudarte con esto, pero tal vez pueda ayudarte con otra pregunta'
            ]
            const randomIndex = Math.floor(Math.random() * array.length);
            const randomValue = array[randomIndex];
            respuesta=randomValue
        }

        return res.json({response:respuesta})

    }else if(action[0].labels[0]=='dialog'){
        let result = await poet(quest[0].translation_text, {
            max_new_tokens: 200,
            temperature: 0.70,
            repetition_penalty: 2.0,
            no_repeat_ngram_size: 3,
            // top_k: 20,
            do_sample: true,
        });
        /*result.generated_text*/
        
        let result2 = await translator(result[0] , {
            src_lang: 'eng_Latn',
            tgt_lang: 'spa_Latn'
        });
    
        return res.json({response:result2[0].translation_text})
    }else if(action[0].labels[0]=='image generated'){
        return res.json({response:'Quieres que genere una imagen'})
    }else if(action[0].labels[0]=='code generated'){
        return res.json({response:'Quieres que genere codigo'})
    }else if(action[0].labels[0]=='music generated'){
        return res.json({response:'Quieres que genere musica'})
    }else if(action[0].labels[0]=='summary generator'){
        return res.json({response:'Quieres que genere un resumen'})
    }
    
} catch (error) {
    console.log(error);
    return res.json({response:'Estamos en pruebas'})
}
    

    

    
    
}


/*indexCtrl.renderDashboard=async(req,res)=>{
	
}*/

export default indexCtrl;