# Meal search algorithm

Extracts entities based on search term.

## Running
Prerequisites: `PostgreSQL` database instance.

```
npm install
npm run migrate
npm start ${searchTerm}
```
Example:
```
npm start sushi in london
```

## Considerations

Cities dataset includes a `Wolverhampton` duplicate which is ommited during migration by using `ON CONFLICT DO NOTHING` clause.

## Further improvements
- Database schema does not include any indexes. For large-scale usage, `GiST or GIN` indexes should be used for fast similar text matching.
- While the search should work with examples specified in the challenge's document, solution might not work with more advanced examples e.g. `veg sushi in london`. This would result in more than one multi-match and would require getting a cartesian product of multi-matches and combining with single matches. This is not implemented due to the challenge time constraints.