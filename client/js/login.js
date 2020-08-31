function redirect(loc){
    window.location.href = loc
}

async function isLoggedIn(){
    let res = await (await fetch("/auth/is-logged-in")).text()
    if (res=="Yes"){
        redirect("/dashboard.html")
    }
}

async function login() {
    const email = document.querySelector(".input [type='email']").value
    const password =document.querySelector(".input [type='password']").value
    
    let res = await fetch("/auth/login",
        {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email,password})
        }
    )
    
    res = await res.text()

    if (res=="Ok"){
        redirect("/dashboard.html")
    }
    else {
        alert(res)
    }
}

isLoggedIn()

document.querySelector(".submit .btn").onclick = login