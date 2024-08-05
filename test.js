let users = [{
    name : "mama",
    id : 1
},
{
    name : "devansh",
    id : 2
}]

const data = {
    name : "tits",
    username: users.find(user => user.id === 1)?.name
}

console.log(data)