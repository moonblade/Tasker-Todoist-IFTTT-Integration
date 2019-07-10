const conditionAs = {
    AND: 'AND',
    OR: 'OR'
}
class condition {
    constructor() {

    }
}

class task {
    constructor(jsonObj) {
        this.condition = condition(jsonObj.condition)
        this.conditionAs = conditionAs.AND
    }

}