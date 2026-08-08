const navLinks = document.getElementById("navLinks")

function showMenu(){
    navLinks.classList.add("open")
}

function hideMenu(){
    navLinks.classList.remove("open")
}

// close the menu on Escape, and on any nav link click
document.addEventListener("keydown", function(e){
    if(e.key === "Escape") hideMenu()
})

navLinks.querySelectorAll("a").forEach(function(link){
    link.addEventListener("click", hideMenu)
})
