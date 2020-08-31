function redirect(loc){
    window.location.href = loc
}

async function isLoggedIn(){
    let res = await (await fetch("/auth/is-logged-in")).text()
    if (res=="Yes"){
        redirect("/dashboard.html")
    }
}

async function signup() {
    const username = document.querySelector(".input [type='text']").value
    const password =document.querySelector(".input [type='password']").value
    const email = document.querySelector(".input [type='email']").value
    let res = await fetch("/auth/signup",
        {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,email,password})
        }
    )
    
    res = await res.text()

    if (res=="Ok"){
        redirect("/dashboard")
    }
}

isLoggedIn()

document.querySelector(".submit .btn").onclick = signup