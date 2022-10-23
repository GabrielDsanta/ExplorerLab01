//Imports//
import "./css/index.css"
import iMask from 'imask'


//Selections//
const ccColor = document.querySelector('.cc-bg svg >g g:nth-child(1) path')
const ccColor2 = document.querySelector('.cc-bg svg >g g:nth-child(2) path')
const CardLogo = document.querySelector('.cc-logo span:nth-child(2) img')
const securityCode = document.querySelector('#security-code')
const expirationDate = document.querySelector('#expiration-date')
const cardNumber = document.querySelector('#card-number')
const cardName = document.querySelector('#CardNameValue')
const addCardButton = document.querySelector('#AddCardButton')
const cardHolderInput = document.querySelector('#card-holder')
const securityCodeValue = document.querySelector('.cc-security .value')
const ccNumber = document.querySelector('.cc-number')
const expirationDateValue = document.querySelector('.cc-expiration .value')


//Events//
addCardButton.addEventListener('click', (e) => {
    e.preventDefault()

    cardHolderInput.value = ''
    cardName.innerText = 'FULANO DA SILVA'

    securityCodeValue.innerText = '123'
    securityCode.value = ''

    ccNumber.innerText = '1234 5678 9012 3456'
    cardNumber.value = ''

    expirationDateValue.innerText = '02/32'
    expirationDate.value = ''
})

cardHolderInput.addEventListener('input', () => {
    cardName.innerText = cardHolderInput.value.length === 0 ? 'FULANO DA SILVA' : cardHolderInput.value
})

//Others//

const PatternSecurityCode = {
    mask: '0000'
}
const MaskSecurityCode = iMask(securityCode, PatternSecurityCode)
MaskSecurityCode.on('accept', () => {
    UpdateSecurityCode(MaskSecurityCode.value)
})


const PatternExpirationDate = {
    mask: 'MM{/}YY',
    blocks: {
        YY:{
            mask: iMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },

        MM: {
            mask: iMask.MaskedRange,
            from: 1,
            to: 12,
        }
    }
}
const MaskExpirationDate = iMask(expirationDate, PatternExpirationDate)
MaskExpirationDate.on('accept', () => {
    UpdateExpirationDate(MaskExpirationDate.value)
})


const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },

        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },

        {
            mask: "0000 0000 0000 0000",
            regex:/^32\d{0,15}/,
            cardtype: "typescript",
        },

        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],

    dispatch: function (appended, dynamicMasked){
        const number =(dynamicMasked.value + appended).replace(/\D/g, "")
        const FindCardType = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        return FindCardType
    }
}
const cardNumberMasked = iMask(cardNumber, cardNumberPattern)
cardNumberMasked.on('accept', () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    SetBackgroundColor(cardType)
    UpdateCardNumber(cardNumberMasked.value)
})


//Functions//

function SetBackgroundColor(card){
    const Color = {
        visa: ['#436D99','#2D57F2'],
        mastercard: ['#DF6F29', '#C69347'],
        typescript: ['#0982BD', '#09AADB'],
        default: ['black', 'gray'],
    }

    ccColor.setAttribute('fill', Color[card][0])
    ccColor2.setAttribute('fill', Color[card][1])

    CardLogo.setAttribute('src', `cc-${card}.svg`)
}

function UpdateSecurityCode(code){
    securityCodeValue.innerText = code.length === 0 ? '123' : code 
}

function UpdateExpirationDate(code){
    expirationDateValue.innerText = code.length === 0 ? '02/32' : code
}

function UpdateCardNumber(code){
    ccNumber.innerText = code.length === 0 ? '1234 5678 9012 3456' : code
}