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
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET /api/projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var projects = await _context.Projects
                .Where(p => p.UserId == userId)
                .Include(p => p.Tasks)
                .ToListAsync();

            return Ok(projects);
        }

        // ✅ POST /api/projects
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return Ok(project);
        }

        // ✅ GET /api/projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var project = await _context.Projects
                .Where(p => p.Id == id && p.UserId == userId)
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync();

            if (project == null)
                return NotFound("Project not found");

            return Ok(project);
        }

        // ✅ DELETE /api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null)
                return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{projectId}/schedule")]
        public async Task<IActionResult> ScheduleProject(int projectId, [FromBody] ScheduleRequest request)
        {
            if (request?.Tasks == null || !request.Tasks.Any())
                return BadRequest("No tasks provided");

            try
            {
                var order = CalculateRecommendedOrder(request.Tasks);
                return Ok(new { recommendedOrder = order });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private List<string> CalculateRecommendedOrder(List<ScheduleTask> tasks)
{
    var graph = new Dictionary<string, List<string>>();
    var inDegree = new Dictionary<string, int>();

    foreach (var task in tasks)
    {
        graph[task.Title] = new List<string>();
        if (!inDegree.ContainsKey(task.Title)) inDegree[task.Title] = 0;
    }

    foreach (var task in tasks)
    {
        foreach (var dep in task.Dependencies)
        {
            if (!graph.ContainsKey(dep)) graph[dep] = new List<string>();
            graph[dep].Add(task.Title);

            if (!inDegree.ContainsKey(task.Title)) inDegree[task.Title] = 0;
            inDegree[task.Title]++;
        }
    }

    var queue = new Queue<string>(inDegree.Where(x => x.Value == 0).Select(x => x.Key));
    var sorted = new List<string>();

    while (queue.Count > 0)
    {
        var current = queue.Dequeue();
        sorted.Add(current);

        foreach (var neighbor in graph[current])
        {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0)
                queue.Enqueue(neighbor);
        }
    }

    if (sorted.Count != tasks.Count)
        throw new Exception("Circular dependency detected");

    return sorted;
}


    }
}
