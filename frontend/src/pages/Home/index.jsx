import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { apiServices } from '../../services/apiServices'
import { Space, Table, Button, Modal, Input } from 'antd';
import './style.css'
import { PlusCircleOutlined  } from "@ant-design/icons";
import { apiUploadFile } from '../../services/apiUploadFile';

const Dashboard = () => {

  const user = JSON.parse(localStorage.getItem('user'))

  const columns = React.useMemo(
    () => 
      [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <span>{text}</span>,
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Verified',
          dataIndex: 'IsVerified',
          key: 'IsVerified',
          render: (text) => <span>{text === false ? "No" : "Yes"}</span>
        },
        {
          title: 'Pending',
          dataIndex: 'isPending',
          key: 'isPending',
          render: (text) => <span>{text === false ? "No" : "Yes"}</span>
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (text) => <span>{text?.split('T')[0]}</span>
        },
        {
          title: 'Supplier Status',
          key: 'supplierStatus',
          dataIndex: 'supplierStatus',
          render: (text) => <span>{text === false ? "No" : "Yes"}</span>
        },
        {
          title: 'File Link',
          key: 'fileLink',
          dataIndex: 'fileLink',
          render: (text, record) => <a href={text} target="_blank"> File <span style={{color: 'black'}}> of {record?.name}  </span> </a>
        },
        // {
          // title: 'Supplier Status',
          // key: 'supplierStatus',
          // dataIndex: 'supplierStatus',
          // render: (_, { tags }) => (
          //   <>
          //     {tags.map((tag) => {
          //       let color = tag.length > 5 ? 'geekblue' : 'green';
          //       if (tag === 'loser') {
          //         color = 'volcano';
          //       }
          //       return (
          //         <Tag color={color} key={tag}>
          //           {tag.toUpperCase()}
          //         </Tag>
          //       );
          //     })}
          //   </>
          // ),
        // },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button type='primary'>Update </Button>
              {/* <a>Update {record.name}</a> */}
            </Space>
          ),
        },
      ], 
    [] );

  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(false)

  const [file, setFile] = useState({
    url: ""
  });

  
  useEffect(() => {
    getOrders()
  }, [])

  const getOrders = async () =>{
   await apiServices("GET", 'order/viewOrder').then((res)=>{
      console.log("all orders===>", res?.data);
      if(res?.data?.Success){
        setOrders(res?.data?.data)
      }else{
        console.log("ERROR fetching orders!");
      }
    })
  }
  

  const orderAction = (type) =>{
    setIsModalOpen(true)
    if(type === "Add"){
      
    }else{
      setEditRecord(true)
    }
  }


  const handleChange =  (file)=>{
    let splashScreen = document.getElementById(`staticFile`).files[0];
    console.log("file====>", file);
    // apiUploadtoS3
    apiUploadFile(splashScreen).then((res) => {
      console.log('splashScreen response =>', res.data.link)
      setFile({
        url: res.data.link
      })
    })
  }

  return (
    <div className='dashboard-page'>
      <Navbar />
      <div className='orders-table'>
        <div className='add-order-action'>
          {
            user?.user?.role === "ENDUSER"
             ?
              <Button 
                onClick={()=>orderAction("Add")}
              >
                <PlusCircleOutlined />
                <span> Add Order </span>
              </Button>
             : null
          }
         
        </div>
        <div className='orders-table-data'>
          <Table columns={columns} dataSource={orders} />
        </div>
      </div>

      {/* MODAL */}
      <Modal 
        title={
          <>
            {editRecord
              ? <span> Edit Order</span>
              : <span> Add Order </span>
            }
          </>
        }
        open={isModalOpen} 
        // onOk={handleOk} 
        onCancel={()=>setIsModalOpen(false)}
        footer={null}
        >
          <div className='modal-content'>
            <p>Name</p>
            <Input placeholder="Basic usage" />
            <p>Description</p>
            <Input placeholder="Basic usage" />
            <p>Upload File</p>
           <div>
            {(file?.url !== "") ?
              <div style={{ width: '100%', height: '100%' }}>
                <img src={file?.url} alt="NoImage" style={{ width: '100%', height: '100%' }} />
              </div>
              :
              <div style={{ height: '100%' }}>
                <label className='static-upload-btn'>
                  <form action="" method="post" enctype="multipart/form-data" >
                    {/* <img src={staticUploader} style={{ display: file?.url ? 'none' : 'inherit' }}
                      alt="."
                    /> */}
                      <input type="file" id="staticFile" onChange={handleChange} />
                  </form>
                </label>
              </div>
            }
           </div>
          </div>
        <div className='modal-actions'>
          {editRecord
            ?
              <Button type='primary'>Update</Button>
              : 
              <Button type='primary'>Save</Button>
          }
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard