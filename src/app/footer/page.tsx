import './style.css'

const Footer = () =>{
    return(
        <div>
            <div className='footer'>
                <div className='col-1'>
                    <label>Elérhetőség:</label>
                    <p>Telefonszám: +36 70 361 8844</p>
                    <p><a href="https://instagram.com/skillhillproject">Instagram</a></p>
                    <p>ProtonMail: olajkarakos05@proton.me</p>
                </div>
                <div className="col-2">
                <p>Minden szerzői jog fenntartva!</p>
                </div>
            </div>
        </div>
    )
}

export default Footer