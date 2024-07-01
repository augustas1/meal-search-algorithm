import { extractEntities } from "./extract-entities";

const [, , ...searTermWords] = process.argv;
const searchTerm = searTermWords.join(' ');

const printExtractedEntities = async (searchTerm: string) => {
    const entities = await extractEntities(searchTerm);
    console.log(JSON.stringify(entities, undefined, 2));
}

printExtractedEntities(searchTerm);