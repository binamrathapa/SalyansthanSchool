using System;

namespace SalyanthanSchool.WebAPI.Helpers
{
    public static class NumberToWordsConverter
    {
        private static readonly string[] Ones = { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
        private static readonly string[] Tens = { "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

        public static string Convert(decimal amount)
        {
            long num = (long)Math.Floor(amount);
            if (num == 0) return "Zero";

            return ConvertNumber(num);
        }

        private static string ConvertNumber(long n)
        {
            if (n < 0) return "Minus " + ConvertNumber(-n);
            if (n < 20) return Ones[n];
            if (n < 100) return Tens[n / 10] + (n % 10 != 0 ? " " + Ones[n % 10] : "");
            if (n < 1000) return Ones[n / 100] + " Hundred" + (n % 100 != 0 ? " " + ConvertNumber(n % 100) : "");
            if (n < 100000) return ConvertNumber(n / 1000) + " Thousand" + (n % 1000 != 0 ? " " + ConvertNumber(n % 1000) : "");
            if (n < 10000000) return ConvertNumber(n / 100000) + " Lakh" + (n % 100000 != 0 ? " " + ConvertNumber(n % 100000) : "");
            if (n < 1000000000) return ConvertNumber(n / 10000000) + " Crore" + (n % 10000000 != 0 ? " " + ConvertNumber(n % 10000000) : "");
            
            return n.ToString();
        }
    }
}
