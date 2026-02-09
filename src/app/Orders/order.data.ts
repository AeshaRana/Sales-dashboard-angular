export type OrderDetail=
{
  id:string,
  onum:string,
  cid:string,
  pid:string,
  odate:string,
  oamount:string,
  ostatus:string
}

export type CustomerData=
{
  id:string,
  firstName:string,
  lastName:string,
  emailId:string,
  phoneNumber:string,
  address:string
}

export type ProductData=
{
  pid:string,
  pname:string,
  ptitle:string,
  pprice:number,
  pdescription:string,
  pcategory:string

}
