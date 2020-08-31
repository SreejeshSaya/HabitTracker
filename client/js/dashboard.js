function redirect(loc){
    window.location.href = loc
}

async function isLoggedIn(){
    let res = await (await fetch("/auth/is-logged-in")).text()
    if (res=="Yes"){
        return true
    }
    return false
}

async function getUserDetails(){
    let res = await fetch("/auth/get-user-details")
    if (res.status==200){
        let user = await res.json()
        return user
    }
    else {
        throw new Error("Not Logged in") 
    }
}

async function getUserHabits(){
    let res = await fetch("/api/get-user-habits")
    let habits = await res.json()
    if (habits.length==0){
        document.querySelector(".habits").innerHTML = "<h1 style='text-align: center; font-size: 1.5rem' > You are empty! Try adding a new habit </h1>"
    }
    else {
        const habitsDiv = document.querySelector(".habits")
        habitsDiv.innerHTML = ""
        habits.forEach(h=>{
            let div =document.createElement("div")
            div.setAttribute("data-id",h._id)
            div.classList.add("habit")
            div.innerHTML = h.text
            let i = document.createElement("i")
            i.classList.add("fa", "fa-check")
            i.onclick = ()=>{
                deleteHabit(h._id)
            }
            div.appendChild(i)
            habitsDiv.appendChild(div)
        })
    }
}

async function addHabit(text){
    let res = await fetch("/api/add-habit",{
        method:"POST",
        body: JSON.stringify({text:text}),
        headers:{'Content-Type':'application/json'}
    })
    res = await res.text()
    getUserHabits()
}

async function deleteHabit(habitId){
    let res = await fetch("/api/delete-habit",{
        method:"POST",
        body: JSON.stringify({habitId}),
        headers:{'Content-Type':'application/json'}
    })
    res = await res.text()
    getUserHabits()
}

async function deleteHabitHandler(e){
    console.log(e.target)
    
}

document.querySelector("nav .btn").onclick = async ()=>{
    let res = await fetch("/auth/logout",{method:"POST"})
    res = await res.text()
    if (res=="Ok"){
        redirect("/login.html")
    }
    else {
        alert(res)
    }
}

let user;

getUserDetails()
.then(u=>{
    user =u
})
.then(()=>{
    return getUserHabits()
})
.catch(err=>{
    console.log(err)
    // redirect("/login.html")
})

document.querySelector(".add-habit .btn").onclick = async function(){
    const text = this.previousElementSibling.value
    addHabit(text)
}


