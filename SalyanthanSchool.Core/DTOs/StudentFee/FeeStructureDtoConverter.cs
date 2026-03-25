using System.Text.Json;
using System.Text.Json.Serialization;

namespace SalyanthanSchool.Core.DTOs.StudentFee
{
    public class FeeStructureDtoConverter
        : JsonConverter<FeeStructureDto>
    {
        public override FeeStructureDto Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            // Not needed for response-only API
            throw new NotImplementedException();
        }

        public override void Write(
            Utf8JsonWriter writer,
            FeeStructureDto value,
            JsonSerializerOptions options)
        {
            writer.WriteStartObject();

            // Write each fee item from DB dynamically
            foreach (var item in value.FeeItems)
            {
                // Convert "Tuition Fee" → "tuition_fee"
                var jsonKey = ConvertToSnakeCase(item.Key);
                writer.WriteNumber(jsonKey, item.Value);
            }

            // Always write base_amount at end
            writer.WriteNumber("base_amount", value.BaseAmount);

            writer.WriteEndObject();
        }
        private static string ConvertToSnakeCase(string name)
        {
            return name
                .ToLower()
                .Replace(" ", "_");
        }
    }
}