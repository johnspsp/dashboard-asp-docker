namespace server.Models.Masters {
    public class Customers
    {
        public int Customer_Id { get; set; }
        required public string Customer { get; set; }
        required public string Customer_Name { get; set; }
        required public string Company_Code { get; set; }
        required public string AM { get; set; }
    }
}
