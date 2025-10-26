using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniPM.Data;
using MiniPM.DTOs;
using MiniPM.Models;
using System.Security.Claims;

namespace MiniPM.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<IActionResult> AddTask(int projectId, CreateTaskDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return NotFound("Project not found");

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpPut("tasks/{taskId}")]
public async Task<IActionResult> UpdateTaskStatus(int taskId, [FromBody] UpdateTaskDto dto)
{
    var task = await _context.Tasks.FindAsync(taskId);
    if (task == null)
        return NotFound("Task not found");

    task.IsCompleted = dto.IsCompleted;
    await _context.SaveChangesAsync();

    return Ok(task);
}


        [HttpDelete("tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
