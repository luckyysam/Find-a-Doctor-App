const input = document.querySelector('.country')
const dropdown = document.querySelector('.country-container');


const onClickStyle = () => {

    console.log('Country container', dropdown)
 return (
    dropdown?.classList.add('active')
 )  
    
}

document.addEventListener('click', onClickStyle)

