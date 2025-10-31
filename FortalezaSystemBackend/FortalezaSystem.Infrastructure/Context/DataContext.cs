using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FortalezaSystem.Infrastructure.Context;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Clientes> Clientes { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<Documento> Documentos { get; set; }
    public DbSet<DadosProfissionais> DadosProfissionais { get; set; }
    public DbSet<Conjuge> Conjuges { get; set; }
    public DbSet<InformacoesPagamento> InformacoesPagamento { get; set; }
    public DbSet<Parcela> Parcelas { get; set; }
    public DbSet<Estoque> Estoque { get; set; }
    public DbSet<FortalezaUser> FortalezaUser { get; set; }
    public DbSet<Pedidos> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("fortaleza");

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(decimal)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }

        var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
            d => d.ToDateTime(TimeOnly.MinValue),
            d => DateOnly.FromDateTime(d)
        );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(DateOnly));

            foreach (var property in properties)
            {
                modelBuilder
                    .Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion(dateOnlyConverter)
                    .HasColumnType("date");
            }
        }

        // ================== CLIENTE ==================
        modelBuilder.Entity<Clientes>(builder =>
        {
            builder.ToTable("Clientes");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Nome).HasMaxLength(150);
            builder.Property(c => c.Filiacao).HasMaxLength(150);
            builder.Property(c => c.Nacionalidade).HasMaxLength(50);
            builder.Property(c => c.Naturalidade).HasMaxLength(50);
            builder.Property(c => c.EstadoCivil).HasMaxLength(30);
            builder.Property(c => c.Email).HasMaxLength(30);
            builder.Property(c => c.Telefone).HasMaxLength(30);

            builder.HasMany(c => c.Enderecos)
                   .WithOne(e => e.Cliente)
                   .HasForeignKey(e => e.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Documento)
                   .WithOne(d => d.Cliente)
                   .HasForeignKey<Documento>(d => d.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.DadosProfissionais)
                   .WithOne(dp => dp.Cliente)
                   .HasForeignKey<DadosProfissionais>(dp => dp.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Conjuge)
                   .WithOne(co => co.Cliente)
                   .HasForeignKey<Conjuge>(co => co.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.FortalezaUser)
                   .WithOne(a => a.Cliente)
                   .HasForeignKey<FortalezaUser>(a => a.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Pedidos)
                   .WithOne(p => p.Cliente)
                   .HasForeignKey(p => p.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // ================== ENDERECO ==================
        modelBuilder.Entity<Endereco>(builder =>
        {
            builder.ToTable("Enderecos");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).ValueGeneratedOnAdd();

            builder.Property(e => e.Logradouro).HasMaxLength(200);
            builder.Property(e => e.Numero).HasMaxLength(10);
            builder.Property(e => e.Bairro).HasMaxLength(100);
            builder.Property(e => e.CEP).HasMaxLength(20);
            builder.Property(e => e.Localizacao).HasMaxLength(100);
            builder.Property(e => e.Cidade).HasMaxLength(100);
            builder.Property(e => e.Estado).HasMaxLength(2);
        });

        // ================== USER ==================
        modelBuilder.Entity<FortalezaUser>(builder =>
        {
            builder.ToTable("FortalezaUser");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Usuario).HasMaxLength(20);
            builder.Property(d => d.SenhaHash).HasMaxLength(50);
            builder.Property(d => d.Status).HasDefaultValue(true);
            builder.Property(d => d.StatusCriar).HasDefaultValue(true);
        });

        // ================== DOCUMENTO ==================
        modelBuilder.Entity<Documento>(builder =>
        {
            builder.ToTable("Documentos");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.RG).HasMaxLength(20);
            builder.Property(d => d.CPF).HasMaxLength(14);
        });

        // ================== DADOS PROFISSIONAIS ==================
        modelBuilder.Entity<DadosProfissionais>(builder =>
        {
            builder.ToTable("DadosProfissionais");
            builder.HasKey(dp => dp.Id);

            builder.Property(dp => dp.Empresa).HasMaxLength(150);
            builder.Property(dp => dp.Telefone).HasMaxLength(20);
            builder.Property(dp => dp.Salario).HasColumnType("decimal(18,2)");

            builder.HasOne(dp => dp.EnderecoEmpresa)
                   .WithMany()
                   .HasForeignKey(dp => dp.EnderecoEmpresaId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        // ================== CONJUGE ==================
        modelBuilder.Entity<Conjuge>(builder =>
        {
            builder.ToTable("Conjuges");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Nome).HasMaxLength(150);
            builder.Property(c => c.Naturalidade).HasMaxLength(100);
            builder.Property(c => c.LocalDeTrabalho).HasMaxLength(150);

            builder.HasOne(c => c.Documento)
                   .WithMany()
                   .HasForeignKey(c => c.DocumentoId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        // ================== ESTOQUE (PRODUTO) ==================
        modelBuilder.Entity<Estoque>(builder =>
        {
            builder.ToTable("Estoque");
            builder.HasKey(a => a.Id);
        });

        // ================== PEDIDO ==================
        modelBuilder.Entity<Pedidos>(builder =>
        {
            builder.ToTable("Pedidos");
            builder.HasKey(p => p.Id);

            builder.HasOne(p => p.Cliente)
                   .WithMany(c => c.Pedidos)
                   .HasForeignKey(p => p.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.Itens)
                   .WithOne(i => i.Pedido)
                   .HasForeignKey(i => i.PedidoId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // ================== ITEM PEDIDO (NOVO) ==================
        modelBuilder.Entity<ItemPedido>(builder =>
        {
            builder.ToTable("ItensPedido");
            builder.HasKey(i => i.Id);

            builder.Property(i => i.Quantidade);
            builder.Property(i => i.PrecoUnitario).HasColumnType("decimal(18,2)");

            builder.HasOne(i => i.Pedido)
                   .WithMany(p => p.Itens)
                   .HasForeignKey(i => i.PedidoId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(i => i.Produto)
                   .WithMany()                  // se quiser, crie ICollection<ItemPedido> em Estoque
                   .HasForeignKey(i => i.ProdutoId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(i => i.InformacoesPagamento)
                   .WithOne(ip => ip.ItemPedido)
                   .HasForeignKey<InformacoesPagamento>(ip => ip.ItemPedidoId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // ================== INFORMACOES PAGAMENTO ==================
        modelBuilder.Entity<InformacoesPagamento>(builder =>
        {
            builder.ToTable("InformacoesPagamento");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.ValorTotal).HasColumnType("decimal(18,2)");
            builder.Property(p => p.Sinal).HasColumnType("decimal(18,2)");
            builder.Property(p => p.DataInicio);
            builder.Property(p => p.NumeroParcelas);

            builder.HasIndex(p => p.ItemPedidoId).IsUnique();

            builder.HasMany(p => p.Parcelas)
                   .WithOne(pa => pa.InformacoesPagamento)
                   .HasForeignKey(pa => pa.InformacoesPagamentoId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // ================== PARCELA ==================
        modelBuilder.Entity<Parcela>(builder =>
        {
            builder.ToTable("Parcelas");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Numero);
            builder.Property(p => p.Valor).HasColumnType("decimal(18,2)");
            builder.Property(p => p.Vencimento);

            builder.Property(p => p.StatusPagamento)
                   .HasConversion<int>()
                   .HasDefaultValue(EStatusPagamento.Pendente);
        });
    }
}
