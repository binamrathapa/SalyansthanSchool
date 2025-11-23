using System;


namespace SalyanthanSchool.Core.DTOs
{
    public class RoutineDTO
    {
        public int Id { get; set; }
        public TimeSpan TimeSlot { get; set; }
        public int Priority { get; set; }
    }
}