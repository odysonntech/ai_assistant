import { pipeline } from '@xenova/transformers';
let poet = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
let translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');


let quest = await translator('Dame un prompt para generar una imagen de un ángel arrodillado rezando', {
    src_lang: 'spa_Latn',
    tgt_lang: 'eng_Latn'
});

let result = await poet(quest[0].translation_text, {
    max_new_tokens: 200,
    temperature: 1,
    repetition_penalty: 2.0,
    no_repeat_ngram_size: 3,
    // top_k: 20,
    // do_sample: true,
});

let result2 = await translator(result[0], {
    src_lang: 'eng_Latn',
    tgt_lang: 'spa_Latn'
});
// [ { translation_text: 'I like to walk my dog.' } ]
console.log(result2[0].translation_text);