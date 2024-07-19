using AutoMapper;

namespace server.Models
{
    public class SalesEntry
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public int Year { get; set; }
        public string? Company { get; set; }
        public int Month { get; set; }
        public string? Material_Code { get; set; }
        public string? Products { get; set; }
        public string? Product_Category_Detail { get; set; }
        public string? Dd { get; set; }
        public string? Mapping_Report { get; set; }
        public string? Division { get; set; }
        public string? Customer_Group { get; set; }
        public string? Customer_Code { get; set; }
        public string? Customer_Name { get; set; }
        public int Quantity { get; set; }
        public decimal Selling_Price { get; set; }
        public string? Currency { get; set; }
        public decimal Rate { get; set; }
        public decimal Total_Sales { get; set; }
        public int Am_Number { get; set; }
        public decimal Cogs { get; set; }
        public decimal Margin { get; set; }
        public string? Log_Sales_Id { get; set; }
    }

    public class FullMappingProfile : Profile
    {
        public FullMappingProfile()
        {
            CreateMap<SalesEntry, SalesEntry>();
        }
    }
}
