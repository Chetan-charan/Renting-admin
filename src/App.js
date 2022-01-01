
import './App.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { Switch, Route } from "react-router-dom";
import TextField from '@mui/material/TextField';
import {useHistory} from 'react-router-dom';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
const url = 'https://equipment-renting.herokuapp.com'

function App() {





  return (
    <div className="App">

    <Switch>
    <Route path="/login">
      <Login/>
    </Route>
    <Route path="/homepage">
      <HomePage/>
    </Route>
    <Route path="/">
    <Redirect to='/login' />
    </Route>
   </Switch>
   

  
      
    </div>
  );
}

function Login(){
  const history = useHistory();

  const formValidationSchema = yup.object({
    username: yup.string().min(4, 'Minimum 4 characters required!!').required('required'),
    password: yup.string()
    .required('No password provided.') 
    .min(8, 'Password is too short - should be 8 chars minimum.').required("required")
  });

  const { handleSubmit, handleChange, handleBlur, errors, touched, values } = useFormik(
    {
      initialValues: { username: '', password: '' },
      validationSchema: formValidationSchema,

      onSubmit: (values) => {

        fetch(`${url}/login`, {
          method: 'POST', body: JSON.stringify(values), headers: {
            'Content-Type': 'application/json'
          },
        }).then((data) => data.json())
          .then((data) => {

            history.push("/homepage");
          })
          }
          

      }
    );





  return <div className="login-form"  > <form onSubmit={handleSubmit}>
    <div className='add-fields'>

      <TextField name='username'
        onBlur={handleBlur}
        helperText={errors.username && touched.username && errors.username}
        value={values.username}
        error={errors.username && touched.username}
        onChange={handleChange}
        id="username"
        label="username"
        variant="standard" />



      <TextField name='password'
        onBlur={handleBlur}
        type='password'
        value={values.password}
        helperText={errors.password && touched.password && errors.password}
        onChange={handleChange}
        error={errors.password && touched.password}
        id="standard-basic"
        label='password'
        variant="standard" />

      <Button type='submit' variant="outlined">Login</Button>
    </div>
  </form>
  
  </div>;
  
}

function HomePage(){

  const [orders,setOrders] = useState();
  const history = useHistory();
 
  useEffect(()=> {
      fetch(`${url}/orders`)
      .then((data) => data.json())
      .then((data2) => setOrders(data2));
  },[])

  function handleLogout(){
    history.push('/login')
  }

  return  <div>
 <Button style={{marginLeft: '95%'}} onClick={handleLogout}><LogoutIcon /></Button>
  <AddItem/>
  <h2 style={{marginLeft: '25px',marginTop:'50px', letterSpacing: '2px'}} >ORDERS </h2>
  <div className='all-orders'> 
    { orders ? orders.map((order) => <Order 
    key={order.order_Id}
    customer={order.customer} 
    items={order.items} 
    orderId={order.order_Id} 
    dateRange={order.dateRange}
    amount={order.amount} />) : '' }
  </div>
  </div>

}

function Order({customer,items,orderId,dateRange,amount}){
 
  return <div className='order-details'>
    <h5>Order Details : </h5>
    <p>Items:</p>{items.map(item =>  <li>{item.name}</li> )}
    <p>Amount Received: Rs.{amount}</p>
    <p>Order ID: {orderId}</p>
    
    <p>From: {dateRange[0].slice(0,10)} To: {dateRange[1].slice(0,10)} </p>
    <div >
      <h5>Customer Details: </h5>
    <p>Name: {customer.name}</p>
    <p>Mobile: {customer.phone}</p>
    <p>Email: {customer.email}</p>
    </div>
  </div>

}

const formValidationSchema = yup.object({
  name: yup.string().min(4,'Minimum 4 characters required!!').required('required'),                 
  picUrl: yup.string().required('required'),
  price: yup.number().required('required'),
});

function AddItem() {

 const [category,setCategory] = useState('none');
 const [message,setMessage] = useState(null);

  const {handleSubmit,handleChange,handleBlur,errors,touched,values} = useFormik(    
      {initialValues: {name: '',picUrl: '',price: ''},
      validationSchema: formValidationSchema,
      
      onSubmit: (values,{ resetForm}) => {
        

          fetch(`${url}/${category}`,{method: 'POST',body: JSON.stringify(values),headers: {
            'Content-Type': 'application/json'
          },}).then((response) => response.json())
          .then((data) => setMessage(data.message));
          resetForm({});
        
      }
  })

function selectCategory(event){
  
  setCategory(event.target.value);
}

  return <div>
    <div>
     <h2 style={{marginLeft: '25px', letterSpacing: '2px'}}>ADD ITEM</h2>
    </div>
    <form onSubmit={handleSubmit}>
  <div className='add-fields'>
  <FormControl sx={{ m: 1 }}>

<InputLabel >category</InputLabel>

<Select
  labelId="demo-simple-select-helper-label"
  id="demo-simple-select-helper"
  
  label="Mentor"
  onChange={selectCategory}>
  
          <MenuItem value="furniture">furniture</MenuItem>
          <MenuItem value="appliances">Appliances</MenuItem>
          <MenuItem value="funzone">Funzone</MenuItem>
          <MenuItem value="laptops">Laptops</MenuItem>
  
</Select>

</FormControl>
  <TextField   name='name'
  onBlur={handleBlur} 
  helperText={errors.name && touched.name && errors.name} 
  value={values.name}  
  error ={errors.name && touched.name}
  onChange={handleChange} 
  id="name" 
  label="name" 
  variant="standard" />
  
  <TextField name='picUrl'  
  onBlur={handleBlur} 
  value={values.picUrl}
  helperText={errors.id && touched.picUrl && errors.picUrl} 
  onChange={handleChange} 
  error={errors.picUrl && touched.picUrl}
  id="pic"
  label='pic'  
  variant="standard" />

  <TextField  name='price' 
  onBlur={handleBlur}   
  value={values.price}
  helperText={errors.price && touched.price && errors.price}
  onChange={handleChange}
  error={errors.price && touched.price}
  id="standard-basic" 
  label="price" 
  variant="standard" />

  <Button type='submit' variant="contained">Add Item</Button>
  <p style={{color: 'green', display: message ? 'block': 'none' }}>{message}</p>
  </div>
  </form>
  </div>

}


export default App;
