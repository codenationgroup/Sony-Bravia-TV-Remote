# Sony-Bravia-TV-Remote
An Express JS powered, mobile interface for your Sony Bravia TV. 

## Instructions
- Download and unzip from GitHub, install Node JS and use VSC or Command Prompt to run
- In terminal, cd into the directory and do `npm i`
- Replace your TV's local IP address and insert your PSK (Pre-Shared Key)
- Run `node .` and navigate to your computer's local ip address.

## Explanation
This project uses 2 different methods over a local connection. 
- IRCC-IP 
- Sony's REST API (On tv)

This project is built by using an Express JS backend that delivers controls to the user's browser (using HTML form actions) to check what the user requests and sends the requests of the user via the machine on the local network to the TV

## Other Notes:
- This project was made by CloudAPI.one
- This is made for mobile and PC layout will look weird (For now)
- If you can, please help with the CSS. I'm terrible at it
