const user=document.querySelector(".user");
const password=document.querySelector(".password");
const okay=document.querySelector("#okay");
const remind=document.querySelector("#remind")
okay.addEventListener('click',async(event)=>{
    event.preventDefault();
    const userInput=user.value.trim();
    const passInput=password.value.trim()
    if(userInput===''||passInput==='')return
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username:userInput, password:passInput })
    })
    const result = await response.json()
    if (result.success) {
        localStorage.setItem("currentUser",JSON.stringify(result.user));
            alert("Login successful!");
        user.value='';
        password.value=''
        window.location.href = "index.html";
    } else {
        remind.textContent = result.message;
        remind.style.display = "block";
        user.value='';
        password.value='';
    
    }
})