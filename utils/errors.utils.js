module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" };
  
    if (err.message.includes("pseudo"))
      errors.pseudo = "Pseudo invalid or already taken";
  
    if (err.message.includes("email")) errors.email = "Email invalid";
  
    if (err.message.includes("password"))
      errors.password = "the password should contain at least 6 characters";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
      errors.pseudo = "Peusdo already taken";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Email already registered";
  
    return errors;
  };
  
  module.exports.signInErrors = (err) => {
    let errors = { email: '', password: ''}
  
    if (err.message.includes("email")) 
      errors.email = "Email unknown";
    
    if (err.message.includes('password'))
      errors.password = "Wrong password..."
  
    return errors;
  }
  
  module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ""};
  
    if (err.message.includes('invalid file'))
      errors.format = "Format incompatabile";
  
    if (err.message.includes('max size'))
      errors.maxSize = "the file is bigger than 500ko";
  
    return errors
  }