/*
Returns if column is expected from server or to be
pushed from server.
*/

module.exports = {
    IsPull(chmodParams) {
        if (! chmodParams.hasOwnProperty('isPull'))  {return false}
        if (  chmodParams['isPull'])  {return true}
        return false
    },
    IsPush(chmodParams) {
        if (! chmodParams.hasOwnProperty('isPush'))  {return false}
        if (  chmodParams['isPush'] )  {return true}
        return false
    }
}