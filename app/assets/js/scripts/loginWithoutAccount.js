/**
 * Script for loginWAccount.ejs
 */
// Validation Regexes.
const validWAUsername         = /^[a-zA-Z0-9_]{1,16}$/

// Login Elements
const loginWACancelContainer  = document.getElementById('loginWithoutCancelContainer')
const loginWACancelButton     = document.getElementById('loginWithoutCancelButton')
const loginWAUsername         = document.getElementById('loginWithoutUsername')
// const checkmarkContainer    = document.getElementById('checkmarkWithoutContainer')
// const loginRememberOption   = document.getElementById('loginWithoutRememberOption')
const loginWAButton           = document.getElementById('loginWithoutButton')
// const loginForm             = document.getElementById('loginWithoutForm')
// Control variables.


// Emphasize errors with shake when focus is lost.
loginWAUsername.addEventListener('focusout', (e) => {
    if(e.target.value != "") {
        loginWADisabled(false)
    } else {
        loginWADisabled(true)
    }
})

// Validate input for each field.
loginWAUsername.addEventListener('input', (e) => {
    if(e.target.value != "") {
        loginWADisabled(false)
    } else {
        loginWADisabled(true)
    }
})

function loginWACancelEnabled(val){
    if(val){
        $(loginWACancelContainer).show()
    } else {
        $(loginWACancelContainer).hide()
    }
}

function loginWADisabled(v){
    if(loginWAButton.disabled !== v){
        loginWAButton.disabled = v
    }
}

function loginWALoading(v){
    if(v){
        loginWAButton.setAttribute('loading', v)
        loginWAButton.innerHTML = loginWAButton.innerHTML.replace(Lang.queryJS('login.login'), Lang.queryJS('login.loggingIn'))
    } else {
        loginWAButton.removeAttribute('loading')
        loginWAButton.innerHTML = loginWAButton.innerHTML.replace(Lang.queryJS('login.loggingIn'), Lang.queryJS('login.login'))
    }
}
loginWACancelButton.onclick = (e) => {
    switchView(getCurrentView(), loginViewOnCancel, 500, 500, () => {
        loginWACancelEnabled(false)
        // if(loginViewCancelHandler != null){
        //     loginViewCancelHandler()
        //     loginViewCancelHandler = null
        // }
    })
}
// We will use removeMicrosoftAccount for remove a free account
loginWAButton.addEventListener('click', (e) => {
    
    e.preventDefault()
    loginWALoading(true)

    AuthManager.addFreeAccount(loginWAUsername.value).then((value) =>{
        updateSelectedAccount(value)
        setTimeout(() => {
            switchView(VIEWS.loginWithoutAccount, loginViewOnSuccess, 500, 500, async () => {
                // Temporary workaround
                if(loginViewOnSuccess === VIEWS.settings){
                    await prepareSettings()
                }
                loginViewOnSuccess = VIEWS.landing 
                $('.circle-loader').toggleClass('load-complete')
                $('.checkmark').toggle()
                loginWALoading(false)
                loginWAButton.innerHTML = loginWAButton.innerHTML.replace(Lang.queryJS('login.success'), Lang.queryJS('login.login'))
            })
        }, 1000)
    }).catch((displayableError) => {
      
    })
})