using SalyanthanSchool.Core.DTOs.StudentDiscount;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IStudentDiscountService
    {
        Task<IEnumerable<StudentDiscountResponseDto>> GetAsync(StudentDiscountQueryParameter query);
        Task<StudentDiscountResponseDto?> GetByIdAsync(int id);
        Task<StudentDiscountResponseDto> CreateAsync(StudentDiscountRequestDto dto);
        Task<bool> DeleteAsync(int id);

        // Added: Toggle active status without deleting (Best Practice)
        Task<bool> ToggleActiveStatusAsync(int id);
    }
}